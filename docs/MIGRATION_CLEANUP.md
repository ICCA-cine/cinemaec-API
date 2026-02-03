# Limpieza de Migraciones - Movies Module

## Problema Identificado

**Error en Cloud Run:**
```
QueryFailedError: type "public.movies_type_enum" does not exist
at UpdateMovieTypesAndAddDocumentaryGenre1769622800000.up
```

### Causa Raíz

Teníamos **41 migraciones incrementales** del módulo de movies (timestamps 1738000000001-1769815213191) que intentaban ejecutarse **ANTES** de la migración baseline (1769900000000).

Orden de ejecución incorrecto:
1. ❌ `1769622800000-UpdateMovieTypesAndAddDocumentaryGenre.ts` - intenta modificar enum que no existe
2. ❌ `1769623098782-CreateSubgenreAndMovieSubgenreRelation.ts` - intenta crear tabla con FK que no existe
3. ... 39 migraciones más ...
4. ✅ `1769900000000-BaselineMoviesSchema.ts` - **finalmente** crea los enums y tablas base

**Resultado:** Failures en cadena porque las migraciones intentaban modificar estructuras inexistentes.

## Solución Aplicada

### 1. Archivado de Migraciones Incrementales

Movimos **41 migraciones viejas** a `src/migrations-archived/movies-old/`:
- `1738000000001-CreateMoviesTable.ts` → Archivado
- `1739000000008-CreateProfessionalsTable.ts` → Archivado
- `1739000000009-CreateCompaniesTable.ts` → Archivado
- ... 38 migraciones más → Archivadas

### 2. Estructura Final de Migraciones

Ahora solo quedan **18 migraciones activas**:

#### Base del Sistema (17 migraciones)
```
1732071600000-CreateUsersTable.ts
1733000000000-CreateAssetsTable.ts
1733000000001-CreateProfilesTable.ts
1733500000000-CreateSpacesTable.ts
1734500000000-CreateContractsTable.ts
1735000000002-CreateNotificationsTable.ts
1735000000003-CreateSpaceReviewsTable.ts
1736100000000-AddMissingAssetOwnerEnumValues.ts
1737000000000-RemoveFirstNameLastNameFromUsers.ts
1737360000000-AddRucToSpaces.ts
1738000000000-CreateGeoAndLanguageTables.ts
1739000000005-ExpandCatalogSeeds.ts
1739000000006-FixProvinceCountryRefs.ts
1739000000007-AccentizeCatalogNames.ts
1740600000000-CreateExhibitionSpacesTable.ts
1740610000000-CreatePlatformsTable.ts
1740620000000-CreateFundsTable.ts
```

#### Movies Module (1 migración baseline)
```
1769900000000-BaselineMoviesSchema.ts ✅
```

## Cómo Funciona la Baseline Migration

La migración baseline **crea toda la estructura de movies** si no existe:

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // 1. Verificar si movies ya existe
  const hasMoviesTable = await queryRunner.hasTable('movies')
  if (hasMoviesTable) {
    return // Ya existe, no hacer nada
  }

  // 2. Crear 12 enums
  await ensureEnum('movies_type_enum', [...])
  await ensureEnum('movies_genre_enum', [...])
  // ... 10 enums más

  // 3. Crear 14 tablas
  CREATE TABLE movies (...)
  CREATE TABLE subgenres (...)
  CREATE TABLE cinematic_roles (...)
  CREATE TABLE movie_professionals (...)
  // ... 10 tablas más

  // 4. Agregar FKs condicionalmente
  await addFkIfPossible('movies', 'ownerId', 'users', 'id')
  // ... 30+ FKs
}
```

### Características de la Baseline

✅ **Idempotente**: Verifica existencia antes de crear  
✅ **Completa**: Crea toda la estructura final en una pasada  
✅ **Segura**: No elimina ni modifica datos existentes  
✅ **Condicional**: FKs solo se agregan si las tablas referenciadas existen  
✅ **Rápida**: Una sola migración vs 41 secuenciales

## Estado en Producción

### Antes (8 tablas)
```sql
assets
contracts
migrations
space_reviews
spaces
users
users_profile
-- NO había nada de movies
```

### Después (22+ tablas)
```sql
-- Base del sistema (8 tablas existentes)
assets, contracts, migrations, space_reviews, spaces, users, users_profile, notifications

-- Geográficas y catálogos
countries, cities, provinces, languages, exhibition_spaces, platforms, funds

-- Movies module (14 nuevas tablas)
movies
subgenres
cinematic_roles
movies_languages (join table)
movies_cities (join table)
movies_provinces (join table)
movies_subgenres (join table)
movies_frame_assets (join table)
movie_professionals
movie_companies
movie_platforms
movie_contacts
movie_content_bank
movie_funding
movie_festival_nominations
movie_national_releases
movie_international_releases
```

## Verificación Post-Deploy

### 1. Verificar que el deployment fue exitoso

```bash
# Ver logs de Cloud Run
gcloud run services logs read api-cinemaec \
  --region=us-central1 \
  --limit=100 \
  --format=json

# Ver último deployment
gcloud run revisions list \
  --service=api-cinemaec \
  --region=us-central1 \
  --limit=5
```

### 2. Logs esperados

```
Starting application in production mode on port 8080...
✅ Application is running in production mode on: http://0.0.0.0:8080
📚 Swagger documentation available at: http://0.0.0.0:8080/api
🎯 Application is ready to accept requests
🔄 Starting migrations in background...
🔄 Initializing database connection...
✅ Database connection established
🔄 Running pending migrations...
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
query: START TRANSACTION
query: SELECT ... FROM "movies" LIMIT 1  -- Checkeando si existe
query: CREATE TYPE "public"."movies_type_enum" AS ENUM(...)
query: CREATE TYPE "public"."movies_genre_enum" AS ENUM(...)
... [creando 12 enums]
query: CREATE TABLE "movies" (...)
query: CREATE TABLE "subgenres" (...)
... [creando 14 tablas]
query: ALTER TABLE "movies" ADD CONSTRAINT "FK_..." FOREIGN KEY (...)
... [agregando 30+ FKs]
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2)
query: COMMIT
✅ Migrations executed successfully
```

### 3. Verificar estructura en la base de datos

```sql
-- Conectarse a Cloud SQL
gcloud sql connect cinema-ec-db --user=postgres --database=cinemaec

-- Verificar tablas de movies
\dt movies*

-- Verificar enums
\dT+ movies_*

-- Verificar registros en tabla de migraciones
SELECT * FROM migrations ORDER BY id DESC LIMIT 20;
```

### 4. Test del endpoint

```bash
# Health check
curl https://api-cinemaec-XXXX-uc.a.run.app/health

# Swagger docs
curl https://api-cinemaec-XXXX-uc.a.run.app/api
```

## Rollback Plan (si fuera necesario)

Si el deployment falla, el rollback es simple:

```bash
# 1. Revertir a la revisión anterior
gcloud run services update-traffic api-cinemaec \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100

# 2. O revertir el código
git revert HEAD
git push origin main
```

**Importante:** La baseline migration es idempotente - si falla a mitad de camino, se puede re-ejecutar sin problemas.

## Migraciones Futuras

Para agregar nuevas funcionalidades a movies:

1. **Crear nueva migración con timestamp actual:**
   ```bash
   npm run migration:create src/migrations/NewMovieFeature
   ```

2. **Hacer la migración idempotente:**
   ```typescript
   public async up(queryRunner: QueryRunner): Promise<void> {
     // Siempre verificar existencia
     const hasColumn = await queryRunner.hasColumn('movies', 'new_column')
     if (!hasColumn) {
       await queryRunner.addColumn('movies', new TableColumn({...}))
     }
   }
   ```

3. **NO modificar la baseline** - es un snapshot del estado inicial

## Resumen de Commits

```
3a56d62 - refactor: archive old movies migrations and use only baseline migration
15a608b - fix: configure Cloud Run deployment with proper startup probe
c2f5e60 - feat: add baseline movies schema migration
3c166f7 - fix: make StandardizeMoviesJoinTables and UpdateInternationalReleaseCity idempotent
```

## Archivos Modificados

- ✅ Movidos: 41 archivos → `src/migrations-archived/movies-old/`
- ✅ Mantenidos: 18 migraciones activas
- ✅ Baseline: `1769900000000-BaselineMoviesSchema.ts` (398 líneas)
- ✅ Configuración: `cloud-run.yaml`, `cloudbuild.yaml`, `Dockerfile`
- ✅ Documentación: Este archivo + `CLOUD_RUN_CONFIG.md`
