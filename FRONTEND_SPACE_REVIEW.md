# Guía Frontend: Revisión de Espacios (Admin)

## Resumen del flujo

1. Admin con permiso `admin_spaces` inicia sesión y entra al módulo de revisión.
2. Lista espacios por estado: `pending` (nuevos), `under_review` (correcciones), `rejected`, `verified`.
3. Abre detalle, revisa info y timeline de revisiones.
4. Envía decisión:
   - `approve` → espacio pasa a `verified`.
   - `request_changes` → pasa a `under_review`, usuario corrige campos indicados.
   - `reject` → pasa a `rejected`.

## Endpoints clave

- Listar espacios (filtrar por estado): `GET /spaces?status=pending` (o `under_review`).
- Detalle de espacio: `GET /spaces/:id`.
- Historial de revisiones: `GET /spaces/:id/reviews`.
- Enviar revisión: `POST /spaces/:id/review` con body:

```json
{
  "decision": "approve" | "request_changes" | "reject",
  "generalComment": "Comentario opcional",
  "issues": [
    { "field": "managerEmail", "comment": "Debe ser un email válido" }
  ]
}
```

- Notificaciones (UI de badge/panel):
  - `GET /notifications/unread`
  - `GET /notifications/unread/count`
  - `PATCH /notifications/:id/read`
  - `PATCH /notifications/read-all`

## Reglas de negocio (ya en backend)

- Transiciones: `approve` → `verified`; `request_changes` → `under_review`; `reject` → `rejected`.
- Solo admins con `admin_spaces` pueden revisar.
- Al crear espacio: notificación al dueño y a admins (`admin_spaces`).
- Al revisar: notificación al dueño según decisión (success/warning/error).

## UX sugerida

- Bandeja: tabla con filtros de estado, columnas básicas y dueño.
- Detalle: datos completos + timeline (`/spaces/:id/reviews`).
- Form de revisión: selector decisión, `generalComment`, lista dinámica de issues (campo + comentario). Requerir al menos un issue para `request_changes`.
- Acción enviar → refrescar estado y mostrar notificación local.

## Manejo de permisos en frontend

- Mostrar módulo solo si el usuario tiene `admin_spaces` en `user.permissions` (respuesta de login).
- Añadir header `Authorization: Bearer <token>` en todas las peticiones.

## Pruebas manuales rápidas

- Con admin `admin_spaces`:
  - `GET /spaces?status=pending` → devuelve nuevos.
  - `POST /spaces/:id/review` con `request_changes` → status a `under_review` y notificación al dueño.
  - `POST /spaces/:id/review` con `approve` → status a `verified` y notificación de éxito.
- Badge de notificaciones: `GET /notifications/unread/count` aumenta tras revisar.

## Tip: mapeo de estados en UI

- `pending`: pendiente de revisión.
- `under_review`: usuario corrige; admin debe reevaluar.
- `verified`: aprobado.
- `rejected`: rechazado.

## Datos que el backend retorna en login

```json
{
  "accessToken": "...",
  "user": {
    "id": 3,
    "email": "...",
    "role": "admin",
    "is_active": true,
    "has_profile": false,
    "permissions": [
      "admin_spaces",
      "admin_movies",
      "approve_movies_request",
      "admin_users",
      "assign_roles",
      "view_reports",
      "export_data"
    ]
  }
}
```

## Visualización de archivos (fotos, PDFs, documentos)

El espacio devuelve IDs de assets (logoId, photosId, ciDocument, etc.). Para obtener URLs y detalles:

**Endpoint para obtener assets**:

- `GET /assets/:id` → obtiene un asset individual con URL y tipo.

**Ejemplo de flujo en frontend**:

1. Obtén space: `GET /spaces/:id`.
2. Extrae los IDs de assets (logoId, photosId, ciDocument, rucDocument, managerDocument, serviceBill, operatingLicense).
3. Llama a `GET /assets/:id` para cada ID en paralelo:

```typescript
const assetIds = [
  space.logoId,
  ...space.photosId,
  space.ciDocument,
  space.rucDocument,
  space.managerDocument,
  space.serviceBill,
  space.operatingLicense,
]

const assets = await Promise.all(assetIds.map((id) => getAsset(id)))
```

4. Agrupa por tipo de documento:
   - Logo: asset con `ownerType === 'space_logo'`.
   - Fotos: assets con `ownerType === 'space_photo'`.
   - Documentos: todos los demás (cédula, RUC, licencia, etc.).

**Componente de vista de archivo**:

- Imágenes (logo, photos): muestra `<img src={asset.url} />`.
- PDFs y documentos: muestra botón "Ver documento" con link a `asset.url`.

**Helper en API**:

```typescript
export const getAsset = async (id: number): Promise<Asset> => {
  const response = await api.get<Asset>(`/assets/${id}`)
  return response.data
}
```

## Checklist de implementación

- [ ] Añadir filtro por estado en la lista de espacios.
- [ ] Vista de detalle con timeline (`/spaces/:id/reviews`).
- [ ] Obtener y mostrar assets asociados al espacio (logo, fotos, documentos).
- [ ] Form de revisión con issues dinámicos.
- [ ] Llamadas a `POST /spaces/:id/review` con token.
- [ ] Badge de notificaciones usando `/notifications/unread/count`.
- [ ] Marcar notificaciones como leídas (`PATCH /notifications/:id/read` o `/notifications/read-all`).
