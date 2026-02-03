# Configuración de Cloud Run para CinemaEC Backend

## Problema: Startup Probe Timeout

El error `Default STARTUP TCP probe failed 1 time consecutively` ocurre cuando:
1. El contenedor no responde en el puerto esperado (8080) dentro del tiempo límite
2. Las migraciones tardan demasiado y bloquean el inicio del servidor
3. El startup probe timeout es muy corto

## Solución Implementada

### 1. Migraciones Asíncronas en Producción

En `src/main.ts`, el servidor inicia **PRIMERO** y las migraciones se ejecutan en **background**:

```typescript
if (nodeEnv === 'production') {
  await app.listen(port, '0.0.0.0')
  logger.log('✅ Application is ready to accept requests')
  logger.log('🔄 Starting migrations in background...')
  void runMigrations()
}
```

Esto garantiza que:
- El servidor responde al startup probe inmediatamente
- Las migraciones no bloquean el inicio
- Si las migraciones fallan, el servidor sigue corriendo

### 2. Configuración del Puerto

```typescript
const port =
  config.get<number>('PORT') ||
  config.get<number>('APP_PORT') ||
  (nodeEnv === 'production' ? 8080 : 3000)
```

Cloud Run proporciona `PORT=8080` automáticamente.

### 3. Dockerfile Optimizado

- **Eliminado el HEALTHCHECK**: Cloud Run maneja sus propios probes
- **CMD simplificado**: `["node", "dist/main"]`
- **Escucha en 0.0.0.0**: Requerido para aceptar conexiones externas

### 4. Baseline Migration

La migración consolidada `1769900000000-BaselineMoviesSchema.ts`:
- Crea toda la estructura de movies si no existe
- Es idempotente (verifica existencia antes de crear)
- No bloquea por operaciones lentas
- Añade FKs condicionalmente

## Configuración Requerida en Cloud Run

Asegúrate de que el servicio Cloud Run tenga:

```yaml
# Startup Probe - aumentar timeout para permitir inicialización
startupProbe:
  tcpSocket:
    port: 8080
  initialDelaySeconds: 0
  timeoutSeconds: 240      # 4 minutos
  periodSeconds: 10
  successThreshold: 1
  failureThreshold: 1

# Liveness Probe - después de que startup tenga éxito
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  successThreshold: 1
  failureThreshold: 3

# Recursos
resources:
  limits:
    cpu: 2
    memory: 2Gi
  requests:
    cpu: 1
    memory: 512Mi

# Timeout de request
timeout: 300s

# Variables de entorno
env:
  - name: NODE_ENV
    value: production
  - name: PORT
    value: "8080"
```

## Verificar el Deployment

Después del deploy, verifica:

```bash
# 1. Ver logs del servicio
gcloud run services logs read api-cinemaec \
  --region=us-central1 \
  --limit=50

# 2. Verificar configuración del servicio
gcloud run services describe api-cinemaec \
  --region=us-central1 \
  --format=yaml

# 3. Test del endpoint
curl https://api-cinemaec-XXXX-uc.a.run.app/health
```

## Logs Esperados en Startup

```
Starting application in production mode on port 8080...
✅ Application is running in production mode on: http://0.0.0.0:8080
📚 Swagger documentation available at: http://0.0.0.0:8080/api
🎯 Application is ready to accept requests
🔄 Starting migrations in background...
🔄 Initializing database connection...
✅ Database connection established
🔄 Running pending migrations...
✅ Migrations executed successfully
```

## Troubleshooting

### Si el startup probe sigue fallando:

1. **Aumentar el timeout del startup probe** a 300s (5 minutos)
2. **Verificar que NODE_ENV=production** esté configurado
3. **Revisar logs de Cloud Build** para errores de compilación
4. **Verificar conectividad a Cloud SQL** desde Cloud Run

### Si las migraciones fallan:

1. Las migraciones en producción **no detienen el servidor**
2. Ver logs para identificar el error específico
3. Corregir la migración y hacer redeploy
4. Las migraciones son idempotentes - se pueden re-ejecutar

### Si hay timeout en requests:

1. Aumentar `timeout` en Cloud Run a 300s o más
2. Optimizar queries lentos en la base de datos
3. Agregar índices si es necesario
