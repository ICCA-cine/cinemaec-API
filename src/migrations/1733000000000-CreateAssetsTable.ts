import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class CreateAssetsTable1733000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear enum para document_type
    await queryRunner.query(`
      CREATE TYPE "asset_type_enum" AS ENUM('image', 'video', 'document', 'logo', 'other')
    `)

    // Crear enum para owner_type
    await queryRunner.query(`
      CREATE TYPE "asset_owner_enum" AS ENUM(
        'space_logo',
        'space_photo',
        'user_bc_photo',
        'company_logo',
        'company_photos',
        'location_photos',
        'movie_stills',
        'movie_poster'
      )
    `)

    // Crear tabla assets (with camelCase columns for consistency)
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'documentType',
            type: 'asset_type_enum',
            isNullable: false,
          },
          {
            name: 'ownerType',
            type: 'asset_owner_enum',
            isNullable: false,
          },
          {
            name: 'ownerId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'firebasePath',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    )

    // Crear foreign key con users
    await queryRunner.createForeignKey(
      'assets',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )

    // Crear índices para optimizar queries
    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_ASSETS_USER_ID',
        columnNames: ['userId'],
      }),
    )

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_ASSETS_OWNER_TYPE',
        columnNames: ['ownerType'],
      }),
    )

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_ASSETS_OWNER_ID',
        columnNames: ['ownerId'],
      }),
    )

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'IDX_ASSETS_OWNER',
        columnNames: ['ownerType', 'ownerId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.dropIndex('assets', 'IDX_ASSETS_OWNER')
    await queryRunner.dropIndex('assets', 'IDX_ASSETS_OWNER_ID')
    await queryRunner.dropIndex('assets', 'IDX_ASSETS_OWNER_TYPE')
    await queryRunner.dropIndex('assets', 'IDX_ASSETS_USER_ID')

    // Eliminar tabla
    await queryRunner.dropTable('assets')

    // Eliminar enums
    await queryRunner.query(`DROP TYPE IF EXISTS "asset_owner_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "asset_type_enum"`)
  }
}
