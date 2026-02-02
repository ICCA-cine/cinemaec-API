import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CreateExhibitionSpacesTable1740600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exhibition_spaces',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'ruc',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'countryId',
            type: 'integer',
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
      'exhibition_spaces',
      new TableForeignKey({
        columnNames: ['countryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'RESTRICT',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exhibition_spaces')
  }
}
