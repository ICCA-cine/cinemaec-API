import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUsersTable1732071600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el tipo enum para roles
    await queryRunner.query(`
      CREATE TYPE "user_role" AS ENUM('admin', 'editor', 'user')
    `)

    // Crear tabla users con estructura final (camelCase)
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
            name: 'permissions',
            type: 'text',
            isArray: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
    await queryRunner.query(`DROP TYPE "user_role"`)
  }
}
