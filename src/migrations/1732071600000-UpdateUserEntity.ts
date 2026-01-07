import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class UpdateUserEntity1732071600000 implements MigrationInterface {
  name = 'UpdateUserEntity1732071600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el tipo enum si no existe
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "user_role" AS ENUM('admin', 'editor', 'user');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    // Renombrar columna cedula a cedula (si es necesario mantener datos)
    const tableExists = await queryRunner.hasTable('users')
    if (!tableExists) {
      // Create users table if it doesn't exist (with camelCase columns for new databases)
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'firstName',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'lastName',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'cedula',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
              isNullable: false,
            },
            {
              name: 'emailVerificationToken',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'passwordResetToken',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'passwordResetExpires',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'role',
              type: 'user_role',
              default: "'user'",
              isNullable: false,
            },
            {
              name: 'profileId',
              type: 'integer',
              isNullable: true,
            },
            {
              name: 'lastLogin',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
        true,
      )
    } else if (tableExists) {
      const table = await queryRunner.getTable('users')

      // Agregar columna role si no existe
      const hasRoleColumn = table?.findColumnByName('role')
      if (!hasRoleColumn) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          ADD COLUMN "role" "user_role" NOT NULL DEFAULT 'user'
        `)
      }

      // Renombrar isEmailVerified a is_active si existe
      const hasIsEmailVerified = table?.findColumnByName('isEmailVerified')
      if (hasIsEmailVerified) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          RENAME COLUMN "isEmailVerified" TO "is_active"
        `)
      }

      // Renombrar emailVerificationToken a email_verification_token si existe
      const hasEmailVerificationToken = table?.findColumnByName(
        'emailVerificationToken',
      )
      if (hasEmailVerificationToken) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          RENAME COLUMN "emailVerificationToken" TO "email_verification_token"
        `)
      }

      // Renombrar passwordResetToken a password_reset_token si existe
      const hasPasswordResetToken =
        table?.findColumnByName('passwordResetToken')
      if (hasPasswordResetToken) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          RENAME COLUMN "passwordResetToken" TO "password_reset_token"
        `)
      }

      // Renombrar passwordResetExpires a password_reset_expires si existe
      const hasPasswordResetExpires = table?.findColumnByName(
        'passwordResetExpires',
      )
      if (hasPasswordResetExpires) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          RENAME COLUMN "passwordResetExpires" TO "password_reset_expires"
        `)
      }

      // Agregar columna profile_id si no existe
      const hasProfileId = table?.findColumnByName('profile_id')
      if (!hasProfileId) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          ADD COLUMN "profile_id" integer
        `)
      }

      // Agregar columna last_login si no existe
      const hasLastLogin = table?.findColumnByName('last_login')
      if (!hasLastLogin) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          ADD COLUMN "last_login" timestamp
        `)
      }

      // Renombrar createdAt a created_at si existe
      const hasCreatedAt = table?.findColumnByName('createdAt')
      if (hasCreatedAt) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          RENAME COLUMN "createdAt" TO "created_at"
        `)
      }

      // Eliminar columna updatedAt si existe
      const hasUpdatedAt = table?.findColumnByName('updatedAt')
      if (hasUpdatedAt) {
        await queryRunner.query(`
          ALTER TABLE "users" 
          DROP COLUMN "updatedAt"
        `)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios
    const tableExists = await queryRunner.hasTable('users')
    if (tableExists) {
      await queryRunner.query(`
        ALTER TABLE "users" DROP COLUMN IF EXISTS "role"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_id"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" DROP COLUMN IF EXISTS "last_login"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        RENAME COLUMN "is_active" TO "isEmailVerified"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        RENAME COLUMN "email_verification_token" TO "emailVerificationToken"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        RENAME COLUMN "password_reset_token" TO "passwordResetToken"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        RENAME COLUMN "password_reset_expires" TO "passwordResetExpires"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        RENAME COLUMN "created_at" TO "createdAt"
      `)
      await queryRunner.query(`
        ALTER TABLE "users" 
        ADD COLUMN "updatedAt" timestamp DEFAULT NOW()
      `)
    }

    await queryRunner.query(`DROP TYPE IF EXISTS "user_role"`)
  }
}
