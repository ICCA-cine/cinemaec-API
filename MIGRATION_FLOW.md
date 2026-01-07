# Flujo de Migraciones para Despliegue en Render

## Orden de Ejecución (Fresh Database)

La base de datos se inicializará con las siguientes migraciones en este orden:

### Fase 1: Crear Tablas Base

```
1. 1732071600000-UpdateUserEntity
   └─ Crea tabla "users" con columnas en camelCase
      (id, email, firstName, lastName, isActive, emailVerificationToken,
       passwordResetToken, passwordResetExpires, profileId, lastLogin,
       createdAt, permissions)

2. 1733000000000-CreateAssetsTable
   └─ Crea tabla "assets" con columnas en camelCase
      (id, userId, documentType, ownerType, ownerId, firebasePath,
       createdAt, updatedAt)
      └─ FK: userId → users(id)
      └─ Índices: IDX_ASSETS_USER_ID, IDX_ASSETS_OWNER_TYPE, IDX_ASSETS_OWNER_ID

3. 1733000000001-CreateProfilesTable [NEW]
   └─ Crea tabla "users_profile" con columnas en camelCase + todas las adiciones futuras
      (id, fullName, legalName, tradeName, legalStatus, birthdate, province,
       city, address, phone, agreementDocumentId, hasUploadedAgreement, userId,
       createdAt, updatedAt)
      └─ FK: userId → users(id) - CASCADE
      └─ FK: agreementDocumentId → assets(id) - SET NULL
      └─ Unique: userId

4. 1733500000000-CreateSpacesTable [NEW]
   └─ Crea tabla "spaces" con TODA la estructura final en camelCase
      (incluyendo "target" como array de strings - no varchar)
      (id, name, type, province, city, address, email, phone, coordinates,
       description, target (TEXT[]), managerName, managerPhone, managerEmail,
       technicianInCharge, technicianRole, technicianPhone, technicianEmail,
       capacity, projectionEquipment, soundEquipment, screen,
       boxofficeRegistration, accessibilities, services, operatingHistory,
       mainActivity, otherActivities, commercialActivities, logoId, photosId,
       ciDocument, rucDocument, managerDocument, serviceBill, operatingLicense,
       contractId, status, userId, createdAt, updatedAt)
      └─ FK: userId → users(id) - CASCADE
      └─ Índices: userId, status

5. 1734000000000-RenameToCamelCase
   └─ NO-OP para bases de datos nuevas ✓
      (Verifica si columnas existen antes de renombrar)
      (Útil solo para BD antiguas con snake_case)
      └─ Maneja: users, users_profile, assets
```

### Fase 2: Agregar Columnas Opcionales a Tablas Existentes

```
6. 1734500000000-CreateContractsTable [NEW]
   └─ Crea tabla "contracts" con columnas en camelCase
      (id, userId, adminName, spaceId, contractType, documentUrl,
       startDate, expirationDate, createdAt, updatedAt)
      └─ FK: userId → users(id) - CASCADE
      └─ Índices: userId, spaceId

7. 1735000000000-AddAgreementToProfile [ACTUALIZADO]
   └─ NO-OP para bases de datos nuevas ✓
      (Las columnas ya existen en CreateProfilesTable)
      └─ Verifica si columnas existen antes de agregarlas
      (Útil solo para BD antiguas que las necesitan)

8. 1735000000001-AddPermissionsToUser
   └─ Agrega columna "permissions" (text[]) a tabla "users" si no existe
```

### Fase 3: Crear Tablas Secundarias

```
9. 1735000000002-CreateNotificationsTable
   └─ Crea tabla "notifications" con columnas en camelCase
      (id, userId, title, message, type, isRead, link, createdAt)
      └─ FK: userId → users(id) - CASCADE

10. 1735000000003-CreateSpaceReviewsTable
    └─ Crea tabla "space_reviews" con columnas en camelCase
        (id, spaceId, reviewerUserId, decision, generalComment, issues,
         createdAt, updatedAt)
        └─ FK: spaceId → spaces(id) - CASCADE
        └─ FK: reviewerUserId → users(id) - SET NULL
        └─ Índices: spaceId, createdAt
```

### Fase 4: Agregar Columnas Adicionales

```
11. 1736000000000-AddResolvedToSpaceReviews
    └─ Agrega columnas "resolved" y "resolvedAt" a "space_reviews"
        (resolved: boolean, resolvedAt: timestamp)

12. 1737000000000-ChangeTargetToArray
    └─ NO-OP para bases de datos nuevas ✓
        (target ya existe como array TEXT[] en CreateSpacesTable)
        (Útil solo para BD antiguas que tenían varchar que convertir a array)
```

## Resumen: Contenido de Base de Datos Después del Despliegue

### Tablas Creadas (8)

- ✅ users (14 columnas)
- ✅ assets (8 columnas)
- ✅ users_profile (17 columnas - con agreementDocumentId y hasUploadedAgreement)
- ✅ spaces (42 columnas - con target como array)
- ✅ contracts (10 columnas)
- ✅ notifications (8 columnas)
- ✅ space_reviews (7 columnas)

### Enums Creados

- ✅ LegalStatus (natural_person, legal_entity)
- ✅ SpaceTypeEnum (theater, cinema, cultural_center, multipurpose, other)
- ✅ SpaceStatusEnum (pending, verified, rejected, active, inactive, under_review)
- ✅ ContractTypeEnum (space, content_bank_user, diplomatic_mission, other)
- ✅ assets_ownertype_enum (user, space, user_agreement)

## Ventajas de Este Enfoque

1. **Base de Datos Nueva**: Se crea correctamente desde cero con la estructura FINAL
2. **Base de Datos Antigua**: Las migraciones antiguas (RenameToCamelCase, AddAgreementToProfile, ChangeTargetToArray) siguen funcionando gracias a las verificaciones condicionales
3. **Sin Datos Duplicados**: No se renombra innecesariamente lo que ya está bien
4. **Mantenibilidad**: El histórico de cambios está preservado
5. **Flexibilidad**: Funciona tanto para nuevas deployments como para upgrades de sistemas existentes

## Configuración TypeORM

```typescript
// Para PRODUCCIÓN (Render)
{
  synchronize: false,           // No crea automáticamente
  migrationsRun: true,          // Ejecuta las migraciones
  migrations: [...],             // Array de migraciones
  logging: false,                // Sin logs detallados
}

// Para DESARROLLO
{
  synchronize: true,            // Crea automáticamente desde entidades
  migrationsRun: false,          // No necesita migraciones (sync lo hace)
  logging: true,                 // Con logs detallados
}
```

## Próximos Pasos para Despliegue

1. ✅ Hacer commit y push de estas migraciones
2. ✅ Configurar IP whitelist en GCP Cloud SQL para Render
3. ✅ Establecer variables de entorno en Render Dashboard
4. ✅ Trigger deploy en Render (auto-deploy con GitHub)
5. ✅ Verificar logs de Render para migration execution
6. ✅ Testear endpoints de API
