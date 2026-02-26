import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUncategorizedMovieGenre1771500000000
  implements MigrationInterface
{
  name = 'AddUncategorizedMovieGenre1771500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "movies_genre_enum"
      ADD VALUE IF NOT EXISTS 'Sin catalogar'
    `)
  }

  public async down(): Promise<void> {}
}
