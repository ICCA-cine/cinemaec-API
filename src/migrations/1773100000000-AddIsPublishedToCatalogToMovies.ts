import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsPublishedToCatalogToMovies1773100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'movies',
      new TableColumn({
        name: 'isPublishedToCatalog',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('movies', 'isPublishedToCatalog')
  }
}
