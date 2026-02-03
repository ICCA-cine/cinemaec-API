import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateFundsTable1740620000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE fund_type_enum AS ENUM('fondo', 'festival', 'premio', 'espacios_participacion');
    `)

    await queryRunner.query(`
      CREATE TYPE financial_origin_enum AS ENUM('publico', 'privado', 'mixto', 'desconocido');
    `)

    await queryRunner.createTable(
      new Table({
        name: 'funds',
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
            type: 'fund_type_enum',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'countryId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'origenFinanciero',
            type: 'financial_origin_enum',
            isNullable: false,
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
      'funds',
      new TableForeignKey({
        columnNames: ['countryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'RESTRICT',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('funds')
    await queryRunner.query(`DROP TYPE IF EXISTS financial_origin_enum;`)
    await queryRunner.query(`DROP TYPE IF EXISTS fund_type_enum;`)
  }
}
