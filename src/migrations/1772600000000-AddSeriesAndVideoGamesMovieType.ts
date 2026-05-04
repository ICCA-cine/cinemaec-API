import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSeriesAndVideoGamesMovieType1772600000000 implements MigrationInterface {
  name = 'AddSeriesAndVideoGamesMovieType1772600000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "movies_type_enum"
      ADD VALUE IF NOT EXISTS 'Series'
    `)

    await queryRunner.query(`
      ALTER TYPE "movies_type_enum"
      ADD VALUE IF NOT EXISTS 'Videojuegos'
    `)
  }

  public async down(): Promise<void> {}
}
