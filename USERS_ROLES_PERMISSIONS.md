# Guía de Roles y Permisos - Frontend

## Resumen

Sistema de gestión de roles y permisos para usuarios. Solo administradores con el permiso `assign_roles` pueden modificar roles y permisos de otros usuarios.

## Enums/Constantes

### Roles de Usuario

```typescript
export enum UserRole {
  ADMIN = 'admin', // Administrador del sistema
  EDITOR = 'editor', // Editor de contenido
  USER = 'user', // Usuario regular (sin permisos especiales)
}
```

### Permisos Disponibles

```typescript
export enum PermissionEnum {
  ADMIN_SPACES = 'admin_spaces', // Revisar y aprobar espacios
  ADMIN_MOVIES = 'admin_movies', // Gestionar películas
  APPROVE_MOVIES_REQUEST = 'approve_movies_request', // Aprobar solicitudes de películas
  ADMIN_USERS = 'admin_users', // Gestionar usuarios
  ASSIGN_ROLES = 'assign_roles', // Asignar roles y permisos a otros usuarios
  VIEW_REPORTS = 'view_reports', // Ver reportes
  EXPORT_DATA = 'export_data', // Exportar datos
}
```

## Endpoints

### 1. Obtener Todos los Usuarios (Lista Completa)

**Endpoint:** `GET /users`

**Requiere:**

- Token JWT (Bearer Token) en header `Authorization`
- Solicitante debe ser ADMIN
- Solicitante debe tener permiso `admin_users`

**Response (200):**

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "cedula": "1234567890",
    "role": "admin",
    "isActive": true,
    "permissions": [
      "admin_spaces",
      "admin_movies",
      "admin_users",
      "assign_roles"
    ],
    "profileId": 1,
    "lastLogin": "2024-12-23T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "email": "user@example.com",
    "cedula": "0987654321",
    "role": "user",
    "isActive": true,
    "permissions": null,
    "profileId": 2,
    "lastLogin": "2024-12-22T15:20:00.000Z",
    "createdAt": "2024-02-01T00:00:00.000Z"
  },
  {
    "id": 3,
    "email": "editor@example.com",
    "cedula": "1122334455",
    "role": "editor",
    "isActive": false,
    "permissions": null,
    "profileId": null,
    "lastLogin": null,
    "createdAt": "2024-03-01T00:00:00.000Z"
  }
]
```

**Respuesta 403 (No autorizado):**

```json
{
  "statusCode": 403,
  "message": "No tienes permiso para ver la lista de usuarios",
  "error": "Forbidden"
}
```

**Notas:**

- Los usuarios se ordenan por fecha de creación (más recientes primero)
- Incluye todos los campos: id, email, cedula, role, isActive, permissions, profileId, lastLogin, createdAt
- Útil para construir tablas de gestión de usuarios en el frontend

---

### 2. Actualizar Permisos de un Usuario

**Endpoint:** `PUT /users/:id/permissions`

**Requiere:**

- Token JWT (Bearer Token) en header `Authorization`
- Solicitante debe ser ADMIN
- Solicitante debe tener permiso `assign_roles`

**Parámetros:**

- `:id` - ID del usuario a actualizar (número entero)

**Body (JSON):**

```json
{
  "permissions": [
    "admin_spaces",
    "admin_movies",
    "approve_movies_request",
    "view_reports"
  ]
}
```

**Respuesta 200 (Éxito):**

```json
{
  "id": 3,
  "email": "editor@example.com",
  "cedula": "1234567890",
  "role": "admin",
  "isActive": true,
  "profileId": null,
  "permissions": [
    "admin_spaces",
    "admin_movies",
    "approve_movies_request",
    "view_reports"
  ],
  "createdAt": "2024-12-23T10:30:00.000Z"
}
```

**Respuesta 403 (No autorizado):**

```json
{
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción",
  "error": "Forbidden"
}
```

**Respuesta 404 (Usuario no encontrado):**

```json
{
  "statusCode": 404,
  "message": "Usuario con ID 999 no encontrado",
  "error": "Not Found"
}
```

**Respuesta 400 (Administrador sin permisos):**

```json
{
  "statusCode": 400,
  "message": "Los administradores deben tener al menos un permiso asignado",
  "error": "Bad Request"
}
```

### 3. Obtener Información de un Usuario

**Endpoint:** `GET /users/:id`

**Requiere:**

- Token JWT (Bearer Token) en header `Authorization`

**Parámetros:**

- `:id` - ID del usuario (número entero)

**Respuesta 200:**

```json
{
  "id": 3,
  "email": "editor@example.com",
  "cedula": "1234567890",
  "role": "admin",
  "isActive": true,
  "profileId": null,
  "permissions": ["admin_spaces", "admin_movies"],
  "createdAt": "2024-12-23T10:30:00.000Z"
}
```

## Ejemplos de Uso en Frontend

### Con Axios

```typescript
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

// Obtener lista completa de usuarios (solo admins con admin_users)
export const getAllUsers = async (token: string) => {
  const response = await axios.get(`${API_BASE}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Actualizar permisos de un usuario
export const updateUserPermissions = async (
  userId: number,
  permissions: string[],
  token: string,
) => {
  const response = await axios.put(
    `${API_BASE}/users/${userId}/permissions`,
    { permissions },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

// Obtener información de un usuario
export const getUserInfo = async (userId: number, token: string) => {
  const response = await axios.get(`${API_BASE}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
```

### Ejemplo de Componente React

```typescript
import React, { useState } from 'react'
import { updateUserPermissions, getUserInfo } from './api'

const PermissionManager = ({ userId, token }: Props) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const permissions = [
    { value: 'admin_spaces', label: 'Revisar Espacios' },
    { value: 'admin_movies', label: 'Gestionar Películas' },
    { value: 'approve_movies_request', label: 'Aprobar Solicitudes de Películas' },
    { value: 'admin_users', label: 'Gestionar Usuarios' },
    { value: 'assign_roles', label: 'Asignar Roles' },
    { value: 'view_reports', label: 'Ver Reportes' },
    { value: 'export_data', label: 'Exportar Datos' },
  ]

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserPermissions(userId, selectedPermissions, token)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar permisos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="permission-manager">
      <h3>Gestionar Permisos</h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Permisos actualizados</div>}

      <div className="permissions-list">
        {permissions.map(perm => (
          <label key={perm.value}>
            <input
              type="checkbox"
              checked={selectedPermissions.includes(perm.value)}
              onChange={() => handlePermissionChange(perm.value)}
              disabled={loading}
            />
            {perm.label}
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Guardando...' : 'Guardar Permisos'}
      </button>
    </div>
  )
}

export default PermissionManager
```

## Reglas de Negocio

1. **Solo Admins pueden asignar roles/permisos**
   - Requiere que el solicitante sea ADMIN
   - Requiere permiso `assign_roles`

2. **Solo Admins pueden tener permisos**
   - Si cambias un usuario a rol ADMIN, debes asignarle al menos 1 permiso
   - Usuarios con rol EDITOR o USER no pueden tener permisos (se establecen a null)

3. **Los permisos son específicos para Admins**
   - Los permisos solo funcionan si el usuario tiene rol ADMIN
   - Un usuario con rol USER aunque tenga permisos en la base de datos, no podrá usarlos

## Estados y Transiciones

### Usuario Regular (USER)

- No tiene acceso a funciones administrativas
- `permissions` = null
- No puede tener permisos asignados

### Editor (EDITOR)

- Rol intermedio (preparación para admin)
- `permissions` = null
- No puede tener permisos asignados

### Administrador (ADMIN)

- Acceso completo a funciones administrativas
- `permissions` = array de permisos específicos
- Debe tener al menos 1 permiso
- Puede tener 0 a 7 permisos según necesidad

## Ejemplo de Flujo Completo

1. **Admin autenticado** obtiene token JWT en login
2. **Admin busca usuario** a modificar (GET /users/:id)
3. **Admin selecciona nuevos permisos** en interfaz
4. **Admin guarda cambios** (PUT /users/:id/permissions)
5. **Sistema valida** que solicitante es ADMIN con permiso assign_roles
6. **Sistema actualiza** permisos del usuario
7. **Siguiente login del usuario** incluye nuevos permisos en token

## Validaciones

- Los permisos deben ser valores válidos del enum PermissionEnum
- El array de permisos no puede estar vacío para Admins
- No se puede actualizar el rol de un usuario desde este endpoint (solo permisos)
- El usuario a actualizar debe existir en la base de datos

## Headers Requeridos

```
GET /users/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Tipos TypeScript para Frontend

Agrégalos a tu `FRONTEND_TYPES.md`:

```typescript
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export enum PermissionEnum {
  ADMIN_SPACES = 'admin_spaces',
  ADMIN_MOVIES = 'admin_movies',
  APPROVE_MOVIES_REQUEST = 'approve_movies_request',
  ADMIN_USERS = 'admin_users',
  ASSIGN_ROLES = 'assign_roles',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
}

export interface User {
  id: number
  email: string
  cedula: string
  role: UserRole
  isActive: boolean
  profileId: number | null
  permissions?: string[] | null
  createdAt: Date
}

export interface UpdateUserPermissionsDto {
  permissions?: string[]
}
```
