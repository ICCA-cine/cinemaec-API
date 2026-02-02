import { MigrationInterface, QueryRunner } from 'typeorm'

export class StandardizeMoviesJoinTables1769617500000
  implements MigrationInterface
{
  name = 'StandardizeMoviesJoinTables1769617500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. movies_provinces: rename to camelCase (snake_case → camelCase)
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" RENAME COLUMN "movie_id" TO "movieId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" RENAME COLUMN "province_id" TO "provinceId"`,
    )

    // 2. movies_cities: standardize naming (plural → singular)
    await queryRunner.query(
      `ALTER TABLE "movies_cities" RENAME COLUMN "moviesId" TO "movieId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" RENAME COLUMN "citiesId" TO "cityId"`,
    )

    // 3. movies_languages: standardize naming (plural → singular)
    await queryRunner.query(
      `ALTER TABLE "movies_languages" RENAME COLUMN "moviesId" TO "movieId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" RENAME COLUMN "languagesId" TO "languageId"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert movies_languages
    await queryRunner.query(
      `ALTER TABLE "movies_languages" RENAME COLUMN "languageId" TO "languagesId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" RENAME COLUMN "movieId" TO "moviesId"`,
    )

    // Revert movies_cities
    await queryRunner.query(
      `ALTER TABLE "movies_cities" RENAME COLUMN "cityId" TO "citiesId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" RENAME COLUMN "movieId" TO "moviesId"`,
    )

    // Revert movies_provinces
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" RENAME COLUMN "provinceId" TO "province_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" RENAME COLUMN "movieId" TO "movie_id"`,
    )
  }
}
