import { MigrationInterface, QueryRunner } from 'typeorm'

export class StandardizeMoviesJoinTables1769617500000
  implements MigrationInterface
{
  name = 'StandardizeMoviesJoinTables1769617500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. movies_provinces: rename to camelCase (snake_case → camelCase)
    const hasMovieIdSnake_provinces = await queryRunner.hasColumn('movies_provinces', 'movie_id')
    if (hasMovieIdSnake_provinces) {
      await queryRunner.query(
        `ALTER TABLE "movies_provinces" RENAME COLUMN "movie_id" TO "movieId"`,
      )
    }

    const hasProvinceIdSnake = await queryRunner.hasColumn('movies_provinces', 'province_id')
    if (hasProvinceIdSnake) {
      await queryRunner.query(
        `ALTER TABLE "movies_provinces" RENAME COLUMN "province_id" TO "provinceId"`,
      )
    }

    // 2. movies_cities: standardize naming (plural → singular or snake_case)
    const hasMoviesIdCities = await queryRunner.hasColumn('movies_cities', 'moviesId')
    if (hasMoviesIdCities) {
      await queryRunner.query(
        `ALTER TABLE "movies_cities" RENAME COLUMN "moviesId" TO "movieId"`,
      )
    } else {
      const hasMovieIdSnake_cities = await queryRunner.hasColumn('movies_cities', 'movie_id')
      if (hasMovieIdSnake_cities) {
        await queryRunner.query(
          `ALTER TABLE "movies_cities" RENAME COLUMN "movie_id" TO "movieId"`,
        )
      }
    }

    const hasCitiesId = await queryRunner.hasColumn('movies_cities', 'citiesId')
    if (hasCitiesId) {
      await queryRunner.query(
        `ALTER TABLE "movies_cities" RENAME COLUMN "citiesId" TO "cityId"`,
      )
    } else {
      const hasCityIdSnake = await queryRunner.hasColumn('movies_cities', 'city_id')
      if (hasCityIdSnake) {
        await queryRunner.query(
          `ALTER TABLE "movies_cities" RENAME COLUMN "city_id" TO "cityId"`,
        )
      }
    }

    // 3. movies_languages: standardize naming (plural → singular or snake_case)
    const hasMoviesIdLangs = await queryRunner.hasColumn('movies_languages', 'moviesId')
    if (hasMoviesIdLangs) {
      await queryRunner.query(
        `ALTER TABLE "movies_languages" RENAME COLUMN "moviesId" TO "movieId"`,
      )
    } else {
      const hasMovieIdSnake_langs = await queryRunner.hasColumn('movies_languages', 'movie_id')
      if (hasMovieIdSnake_langs) {
        await queryRunner.query(
          `ALTER TABLE "movies_languages" RENAME COLUMN "movie_id" TO "movieId"`,
        )
      }
    }

    const hasLanguagesId = await queryRunner.hasColumn('movies_languages', 'languagesId')
    if (hasLanguagesId) {
      await queryRunner.query(
        `ALTER TABLE "movies_languages" RENAME COLUMN "languagesId" TO "languageId"`,
      )
    } else {
      const hasLanguageIdSnake = await queryRunner.hasColumn('movies_languages', 'language_id')
      if (hasLanguageIdSnake) {
        await queryRunner.query(
          `ALTER TABLE "movies_languages" RENAME COLUMN "language_id" TO "languageId"`,
        )
      }
    }
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
