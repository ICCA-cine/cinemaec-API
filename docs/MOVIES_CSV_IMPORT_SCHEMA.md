# Movies CSV Import Schema (Producción)

Este esquema está alineado con la entidad actual de `movies` y migraciones posteriores a `1769900000000-BaselineMoviesSchema`.

## 1) Columnas de `movies` para importación

### Requeridas (NOT NULL)

- `title` → `varchar(255)`
- `durationMinutes` → `integer` (> 0 recomendado)
- `type` → enum `movies_type_enum`
- `genre` → enum `movies_genre_enum`
- `synopsis` → `text`
- `classification` → enum `movies_classification_enum`
- `projectStatus` → enum `movies_projectStatus_enum`
- `countryId` → `integer` (FK a `countries.id`)
- `createdById` → `integer` (FK a `users.id`)

### Opcionales (NULL permitidos)

- `titleEn` → `varchar(255)`
- `releaseYear` → `integer`
- `synopsisEn` → `text`
- `logline` → `text`
- `loglineEn` → `text`
- `status` → enum `movies_status_enum` (si no se envía usa default)
- `isActive` → `boolean` (si no se envía usa default)
- `totalBudget` → `numeric(14,2)`
- `economicRecovery` → `numeric(14,2)`
- `spectatorsCount` → `integer`
- `crewTotal` → `integer`
- `actorsTotal` → `integer`
- `projectNeed` → `text`
- `projectNeedEn` → `text`
- `trailerLink` → `varchar(500)`
- `makingOfLink` → `varchar(500)`
- `ownerId` → `integer` (FK a `users.id`, nullable)
- `posterAssetId` → `integer` (FK a `assets.id`, nullable)
- `dossierAssetId` → `integer` (FK a `assets.id`, nullable)
- `dossierAssetEnId` → `integer` (FK a `assets.id`, nullable)
- `pedagogicalSheetAssetId` → `integer` (FK a `assets.id`, nullable)
- `createdAt` → `timestamp` (si no se envía usa default `now()`)
- `updatedAt` → `timestamp` (nullable)

### No incluir en CSV

- `id` (autogenerado)

---

## 2) Enums válidos

### `movies_type_enum`

- `Cortometraje`
- `Mediometraje`
- `Largometraje`
- `Sin catalogar`

### `movies_genre_enum`

- `Ficción`
- `Documental`
- `Docu-ficción`
- `Falso Documental`
- `Sin catalogar`

### `movies_classification_enum`

- `todo_publico`
- `recomendado_0_6`
- `recomendado_6_12`
- `menores_12_supervision`
- `mayores_12`
- `mayores_15`
- `solo_mayores_18`
- `no_especificada`

### `movies_projectStatus_enum`

- `desarrollo`
- `produccion`
- `postproduccion`
- `distribucion`
- `finalizado`

### `movies_status_enum`

- `draft`
- `in_review`
- `approved`
- `rejected`
- `archived`

---

## 3) Recomendación de carga segura

1. Cargar CSV en una tabla staging (`movies_import_staging`) con todo como texto.
2. Validar tipos/enums/FKs.
3. Insertar en `movies` sólo filas válidas.

### DDL sugerido para staging

```sql
CREATE TABLE IF NOT EXISTS movies_import_staging (
  row_num integer,
  title text,
  titleEn text,
  durationMinutes text,
  type text,
  genre text,
  releaseYear text,
  synopsis text,
  synopsisEn text,
  logline text,
  loglineEn text,
  classification text,
  projectStatus text,
  status text,
  isActive text,
  totalBudget text,
  economicRecovery text,
  spectatorsCount text,
  crewTotal text,
  actorsTotal text,
  projectNeed text,
  projectNeedEn text,
  trailerLink text,
  makingOfLink text,
  ownerId text,
  countryId text,
  createdById text,
  posterAssetId text,
  dossierAssetId text,
  dossierAssetEnId text,
  pedagogicalSheetAssetId text,
  createdAt text,
  updatedAt text
);
```

### Validación rápida de enums

```sql
SELECT row_num,
       type, genre, classification, projectStatus, status
FROM movies_import_staging s
WHERE (type IS NOT NULL AND type <> '' AND type NOT IN ('Cortometraje','Mediometraje','Largometraje','Sin catalogar'))
   OR (genre IS NOT NULL AND genre <> '' AND genre NOT IN ('Ficción','Documental','Docu-ficción','Falso Documental','Sin catalogar'))
   OR (classification IS NOT NULL AND classification <> '' AND classification NOT IN (
      'todo_publico','recomendado_0_6','recomendado_6_12','menores_12_supervision',
      'mayores_12','mayores_15','solo_mayores_18','no_especificada'))
   OR (projectStatus IS NOT NULL AND projectStatus <> '' AND projectStatus NOT IN (
      'desarrollo','produccion','postproduccion','distribucion','finalizado'))
   OR (status IS NOT NULL AND status <> '' AND status NOT IN (
      'draft','in_review','approved','rejected','archived'));
```

### Validación rápida de tipos

```sql
SELECT row_num
FROM movies_import_staging s
WHERE (durationMinutes IS NULL OR durationMinutes !~ '^[0-9]+$' OR durationMinutes::int <= 0)
   OR (releaseYear IS NOT NULL AND releaseYear <> '' AND releaseYear !~ '^[0-9]{4}$')
   OR (countryId IS NULL OR countryId !~ '^[0-9]+$')
   OR (createdById IS NULL OR createdById !~ '^[0-9]+$')
   OR (isActive IS NOT NULL AND isActive <> '' AND lower(isActive) NOT IN ('true','false','1','0'));
```

### Validación de FKs

```sql
SELECT s.row_num, s.countryId, s.createdById
FROM movies_import_staging s
LEFT JOIN countries c ON c.id = NULLIF(s.countryId, '')::int
LEFT JOIN users u ON u.id = NULLIF(s.createdById, '')::int
WHERE c.id IS NULL OR u.id IS NULL;
```

---

## 4) Inserción recomendada (solo válidos)

```sql
INSERT INTO movies (
  title, "titleEn", "durationMinutes", type, genre, "releaseYear", synopsis, "synopsisEn",
  logline, "loglineEn", classification, "projectStatus", status, "isActive",
  "totalBudget", "economicRecovery", "spectatorsCount", "crewTotal", "actorsTotal",
  "projectNeed", "projectNeedEn", "trailerLink", "makingOfLink", "ownerId",
  "countryId", "createdById", "posterAssetId", "dossierAssetId", "dossierAssetEnId",
  "pedagogicalSheetAssetId", "createdAt", "updatedAt"
)
SELECT
  s.title,
  NULLIF(s.titleEn, ''),
  s.durationMinutes::int,
  s.type::movies_type_enum,
  s.genre::movies_genre_enum,
  NULLIF(s.releaseYear, '')::int,
  s.synopsis,
  NULLIF(s.synopsisEn, ''),
  NULLIF(s.logline, ''),
  NULLIF(s.loglineEn, ''),
  s.classification::movies_classification_enum,
  s.projectStatus::movies_projectStatus_enum,
  COALESCE(NULLIF(s.status, '')::movies_status_enum, 'approved'::movies_status_enum),
  COALESCE(NULLIF(lower(s.isActive), '') IN ('true','1'), true),
  NULLIF(s.totalBudget, '')::numeric(14,2),
  NULLIF(s.economicRecovery, '')::numeric(14,2),
  NULLIF(s.spectatorsCount, '')::int,
  NULLIF(s.crewTotal, '')::int,
  NULLIF(s.actorsTotal, '')::int,
  NULLIF(s.projectNeed, ''),
  NULLIF(s.projectNeedEn, ''),
  NULLIF(s.trailerLink, ''),
  NULLIF(s.makingOfLink, ''),
  NULLIF(s.ownerId, '')::int,
  s.countryId::int,
  s.createdById::int,
  NULLIF(s.posterAssetId, '')::int,
  NULLIF(s.dossierAssetId, '')::int,
  NULLIF(s.dossierAssetEnId, '')::int,
  NULLIF(s.pedagogicalSheetAssetId, '')::int,
  COALESCE(NULLIF(s.createdAt, '')::timestamp, now()),
  NULLIF(s.updatedAt, '')::timestamp
FROM movies_import_staging s;
```

> Nota: en su lógica actual de negocio, cuando la película se crea por flujo de usuario el estado se maneja como `approved`.
