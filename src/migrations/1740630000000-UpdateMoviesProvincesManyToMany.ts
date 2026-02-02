import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class UpdateMoviesProvincesManyToMany1740630000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing provinceId column and FK if they exist
    const table = await queryRunner.getTable('movies')
    const provinceFk = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('provinceId'),
    )
    if (provinceFk) {
      await queryRunner.dropForeignKey('movies', provinceFk)
    }
    const hasProvinceId = table?.findColumnByName('provinceId')
    if (hasProvinceId) {
      await queryRunner.dropColumn('movies', 'provinceId')
    }

    // Create join table movies_provinces
    await queryRunner.createTable(
      new Table({
        name: 'movies_provinces',
        columns: [
          {
            name: 'movie_id',
            type: 'integer',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'province_id',
            type: 'integer',
            isNullable: false,
            isPrimary: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createForeignKey(
      'movies_provinces',
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    )

    await queryRunner.createForeignKey(
      'movies_provinces',
      new TableForeignKey({
        columnNames: ['province_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'provinces',
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join table
    await queryRunner.dropTable('movies_provinces', true)

    // Recreate provinceId column and FK
    const hasProvinceId = await queryRunner.hasColumn('movies', 'provinceId')
    if (!hasProvinceId) {
      await queryRunner.query(
        `ALTER TABLE "movies" ADD "provinceId" integer NULL`,
      )
    }

    await queryRunner.createForeignKey(
      'movies',
      new TableForeignKey({
        columnNames: ['provinceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'provinces',
        onDelete: 'SET NULL',
      }),
    )
  }
}
