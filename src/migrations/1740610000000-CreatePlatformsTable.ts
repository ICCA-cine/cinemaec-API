import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreatePlatformsTable1740610000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE platform_type_enum AS ENUM('nacional', 'internacional');
    `)

    await queryRunner.createTable(
      new Table({
        name: 'platforms',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tipo',
            type: 'platform_type_enum',
            isNullable: false,
          },
          {
            name: 'logoId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'ownerId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    )

    await queryRunner.createForeignKey(
      'platforms',
      new TableForeignKey({
        columnNames: ['logoId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'assets',
        onDelete: 'SET NULL',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('platforms')
    await queryRunner.query(`DROP TYPE IF EXISTS platform_type_enum;`)
  }
}
