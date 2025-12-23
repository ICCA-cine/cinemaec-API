# Guía Frontend: Revisión de Espacios (Admin)

## Resumen del flujo

1. Admin con permiso `admin_spaces` inicia sesión y entra al módulo de revisión.
2. Lista espacios por estado: `pending` (nuevos o esperando correcciones), `rejected`, `verified`.
3. Abre detalle, revisa info y timeline de revisiones.
4. Envía decisión:
   - `approve` → espacio pasa a `verified`.
   - `request_changes` → pasa a `pending` (espera correcciones del usuario).
   - `reject` → pasa a `rejected`.

## Endpoints clave

- Listar espacios (filtrar por estado): `GET /spaces?status=pending`.
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

- Transiciones: `approve` → `verified`; `request_changes` → `pending` (usuario debe corregir); `reject` → `rejected`.
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
  - `POST /spaces/:id/review` con `request_changes` → status a `pending` y notificación al dueño.
  - `POST /spaces/:id/review` con `approve` → status a `verified` y notificación de éxito.
- Badge de notificaciones: `GET /notifications/unread/count` aumenta tras revisar.

## Tip: mapeo de estados en UI

- `pending`: pendiente de revisión o esperando correcciones del usuario.
- `under_review`: (no se usa actualmente).
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

El backend ahora retorna los assets completos directamente en la respuesta del espacio. Ya no necesitas llamadas adicionales.

**Respuesta de `GET /spaces/:id`** (ahora incluye assets):

```typescript
{
  id: 1,
  name: "Teatro Nacional",
  province: "Pichincha",
  city: "Quito",
  // ... más campos del espacio
  status: "pending",
  assets: {
    logo: {
      id: 123,
      url: "https://storage.googleapis.com/...",
      documentType: "logo",
      ownerType: "space_logo",
      createdAt: "2024-01-01T..."
    },
    photos: [
      { id: 124, url: "https://...", documentType: "image", ownerType: "space_photo", ... },
      { id: 125, url: "https://...", documentType: "image", ownerType: "space_photo", ... }
    ],
    documents: {
      ci: { id: 126, url: "https://...", documentType: "document", ... },
      ruc: null,
      manager: { id: 127, url: "https://...", documentType: "document", ... },
      serviceBill: { id: 128, url: "https://...", documentType: "document", ... },
      operatingLicense: { id: 129, url: "https://...", documentType: "document", ... }
    }
  }
}
```

**Cómo usar en el frontend**:

1. Obtén el espacio: `GET /spaces/:id`.
2. Accede directamente a los assets desde la respuesta:

```typescript
const space = await getSpace(spaceId)
const logoUrl = space.assets.logo?.url
const photos = space.assets.photos.map((p) => p.url)
const docUrls = {
  ci: space.assets.documents.ci?.url,
  ruc: space.assets.documents.ruc?.url,
  manager: space.assets.documents.manager?.url,
  serviceBill: space.assets.documents.serviceBill?.url,
  operatingLicense: space.assets.documents.operatingLicense?.url,
}
```

3. Renderiza en componentes:

```typescript
// Logo
{space.assets.logo && (
  <img src={space.assets.logo.url} alt="Logo del espacio" />
)}

// Fotos
<div className="photos-gallery">
  {space.assets.photos.map(photo => (
    <img key={photo.id} src={photo.url} alt="Foto" />
  ))}
</div>

// Documentos (links de descarga)
<div className="documents">
  {space.assets.documents.ci && (
    <a href={space.assets.documents.ci.url} download="ci.pdf">
      Descargar Cédula
    </a>
  )}
  {space.assets.documents.operatingLicense && (
    <a href={space.assets.documents.operatingLicense.url} download="license.pdf">
      Descargar Licencia
    </a>
  )}
</div>
```

**URLs son públicas** - no requieren autenticación adicional. Puedes usarlas directamente en `<img src={url} />` o `<a href={url}>`.

## Checklist de implementación

- [ ] Añadir filtro por estado en la lista de espacios.
- [ ] Vista de detalle con timeline (`/spaces/:id/reviews`).
- [ ] Obtener y mostrar assets asociados al espacio (logo, fotos, documentos).
- [ ] Form de revisión con issues dinámicos.
- [ ] Llamadas a `POST /spaces/:id/review` con token.
- [ ] Badge de notificaciones usando `/notifications/unread/count`.
- [ ] Marcar notificaciones como leídas (`PATCH /notifications/:id/read` o `/notifications/read-all`).
