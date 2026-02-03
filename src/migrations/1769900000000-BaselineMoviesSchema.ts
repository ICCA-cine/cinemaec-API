import { MigrationInterface, QueryRunner } from 'typeorm'

export class BaselineMoviesSchema1769900000000 implements MigrationInterface {
  name = 'BaselineMoviesSchema1769900000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasMoviesTable = await queryRunner.hasTable('movies')
    if (hasMoviesTable) {
      return
    }

    const ensureEnum = async (typeName: string, values: string[]) => {
      const exists = await queryRunner.query(
        `SELECT EXISTS (
          SELECT 1 FROM pg_type
          WHERE typname = $1
          AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        )`,
        [typeName],
      )
      if (!exists[0].exists) {
        const escaped = values.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ')
        await queryRunner.query(
          `CREATE TYPE "public"."${typeName}" AS ENUM(${escaped})`,
        )
      }
    }

    await ensureEnum('movies_type_enum', [
      'Cortometraje',
      'Mediometraje',
      'Largometraje',
    ])
    await ensureEnum('movies_genre_enum', [
      'Ficción',
      'Documental',
      'Docu-ficción',
      'Falso Documental',
    ])
    await ensureEnum('movies_classification_enum', [
      'todo_publico',
      'recomendado_0_6',
      'recomendado_6_12',
      'menores_12_supervision',
      'mayores_12',
      'mayores_15',
      'solo_mayores_18',
    ])
    await ensureEnum('movies_projectStatus_enum', [
      'desarrollo',
      'produccion',
      'postproduccion',
      'distribucion',
      'finalizado',
    ])
    await ensureEnum('movies_status_enum', [
      'draft',
      'in_review',
      'approved',
      'rejected',
      'archived',
    ])
    await ensureEnum('movie_contacts_cargo_enum', [
      'Productora',
      'Director',
      'Agente de ventas',
      'Distribuidor',
    ])
    await ensureEnum('movie_companies_participation_enum', [
      'Productor',
      'Coproductor',
    ])
    await ensureEnum('movie_funding_fundingStage_enum', [
      'Desarrollo',
      'Producción',
      'Postproducción',
      'Distribución',
    ])
    await ensureEnum('movie_festival_nominations_result_enum', [
      'Ganador',
      'Nominado',
      'Selección oficial',
    ])
    await ensureEnum('movie_national_releases_type_enum', [
      'Comercial',
      'Festival o muestra',
      'Alternativo o itinerante',
    ])
    await ensureEnum('movie_international_releases_type_enum', [
      'Comercial',
      'Festival o muestra',
      'Alternativo o itinerante',
    ])
    await ensureEnum('movie_content_bank_exhibitionWindow_enum', [
      'Nacional',
      'Internacional',
      'VOD',
    ])

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "subgenres" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(100) NOT NULL UNIQUE
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "cinematic_roles" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(100) NOT NULL UNIQUE
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies" (
        "id" SERIAL PRIMARY KEY,
        "title" character varying(255) NOT NULL,
        "titleEn" character varying(255),
        "durationMinutes" integer NOT NULL,
        "type" "public"."movies_type_enum" NOT NULL,
        "genre" "public"."movies_genre_enum" NOT NULL,
        "releaseYear" integer,
        "synopsis" text NOT NULL,
        "synopsisEn" text,
        "logline" text,
        "loglineEn" text,
        "classification" "public"."movies_classification_enum" NOT NULL,
        "projectStatus" "public"."movies_projectStatus_enum" NOT NULL,
        "totalBudget" numeric(14,2),
        "economicRecovery" numeric(14,2),
        "spectatorsCount" integer,
        "crewTotal" integer,
        "actorsTotal" integer,
        "projectNeed" text,
        "projectNeedEn" text,
        "posterAssetId" integer,
        "dossierAssetId" integer,
        "dossierAssetEnId" integer,
        "pedagogicalSheetAssetId" integer,
        "trailerLink" character varying(500),
        "makingOfLink" character varying(500),
        "countryId" integer NOT NULL,
        "createdById" integer NOT NULL,
        "ownerId" integer,
        "isActive" boolean NOT NULL DEFAULT true,
        "status" "public"."movies_status_enum" NOT NULL DEFAULT 'draft',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_languages" (
        "movieId" integer NOT NULL,
        "languageId" integer NOT NULL,
        PRIMARY KEY ("movieId", "languageId")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_cities" (
        "movieId" integer NOT NULL,
        "cityId" integer NOT NULL,
        PRIMARY KEY ("movieId", "cityId")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_provinces" (
        "movieId" integer NOT NULL,
        "provinceId" integer NOT NULL,
        PRIMARY KEY ("movieId", "provinceId")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_subgenres" (
        "movieId" integer NOT NULL,
        "subgenreId" integer NOT NULL,
        PRIMARY KEY ("movieId", "subgenreId")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_frame_assets" (
        "movieId" integer NOT NULL,
        "assetId" integer NOT NULL,
        PRIMARY KEY ("movieId", "assetId")
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_professionals" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "professionalId" integer NOT NULL,
        "cinematicRoleId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_companies" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "companyId" integer NOT NULL,
        "participation" "public"."movie_companies_participation_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_platforms" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "platformId" integer NOT NULL,
        "link" character varying(500),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_contacts" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "professionalId" integer NOT NULL,
        "cargo" "public"."movie_contacts_cargo_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_content_bank" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "licensingStartDate" date NOT NULL,
        "licensingEndDate" date NOT NULL,
        "exhibitionWindow" "public"."movie_content_bank_exhibitionWindow_enum"[] NOT NULL,
        "geolocationRestrictionCountryIds" integer[],
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_funding" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "fundId" integer NOT NULL,
        "year" integer NOT NULL,
        "amountGranted" numeric(12,2),
        "fundingStage" "public"."movie_funding_fundingStage_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_festival_nominations" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "fundId" integer NOT NULL,
        "year" integer NOT NULL,
        "category" character varying(255) NOT NULL,
        "result" "public"."movie_festival_nominations_result_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_national_releases" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "exhibitionSpaceId" integer NOT NULL,
        "cityId" integer NOT NULL,
        "year" integer NOT NULL,
        "type" "public"."movie_national_releases_type_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_international_releases" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "countryId" integer NOT NULL,
        "year" integer NOT NULL,
        "spaceName" character varying(255),
        "type" "public"."movie_international_releases_type_enum" NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )`,
    )

    const addFkIfPossible = async (
      table: string,
      constraint: string,
      column: string,
      refTable: string,
      refColumn: string,
      onDelete: string,
    ) => {
      const refExists = await queryRunner.hasTable(refTable)
      if (!refExists) return

      const fkExists = await queryRunner.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = $1
          AND table_name = $2
        )`,
        [constraint, table],
      )
      if (!fkExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "${table}" ADD CONSTRAINT "${constraint}" FOREIGN KEY ("${column}") REFERENCES "${refTable}"("${refColumn}") ON DELETE ${onDelete} ON UPDATE NO ACTION`,
        )
      }
    }

    await addFkIfPossible('movies', 'FK_movies_country', 'countryId', 'countries', 'id', 'RESTRICT')
    await addFkIfPossible('movies', 'FK_movies_createdBy', 'createdById', 'users', 'id', 'RESTRICT')
    await addFkIfPossible('movies', 'FK_movies_owner', 'ownerId', 'users', 'id', 'SET NULL')
    await addFkIfPossible('movies', 'FK_movies_poster', 'posterAssetId', 'assets', 'id', 'SET NULL')
    await addFkIfPossible('movies', 'FK_movies_dossier', 'dossierAssetId', 'assets', 'id', 'SET NULL')
    await addFkIfPossible('movies', 'FK_movies_dossier_en', 'dossierAssetEnId', 'assets', 'id', 'SET NULL')
    await addFkIfPossible('movies', 'FK_movies_pedagogical', 'pedagogicalSheetAssetId', 'assets', 'id', 'SET NULL')

    await addFkIfPossible('movies_languages', 'FK_movies_languages_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movies_languages', 'FK_movies_languages_language', 'languageId', 'languages', 'id', 'CASCADE')
    await addFkIfPossible('movies_cities', 'FK_movies_cities_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movies_cities', 'FK_movies_cities_city', 'cityId', 'cities', 'id', 'CASCADE')
    await addFkIfPossible('movies_provinces', 'FK_movies_provinces_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movies_provinces', 'FK_movies_provinces_province', 'provinceId', 'provinces', 'id', 'CASCADE')
    await addFkIfPossible('movies_subgenres', 'FK_movies_subgenres_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movies_subgenres', 'FK_movies_subgenres_subgenre', 'subgenreId', 'subgenres', 'id', 'CASCADE')
    await addFkIfPossible('movies_frame_assets', 'FK_movies_frame_assets_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movies_frame_assets', 'FK_movies_frame_assets_asset', 'assetId', 'assets', 'id', 'CASCADE')

    await addFkIfPossible('movie_professionals', 'FK_movie_professionals_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_professionals', 'FK_movie_professionals_professional', 'professionalId', 'professionals', 'id', 'CASCADE')
    await addFkIfPossible('movie_professionals', 'FK_movie_professionals_role', 'cinematicRoleId', 'cinematic_roles', 'id', 'NO ACTION')

    await addFkIfPossible('movie_companies', 'FK_movie_companies_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_companies', 'FK_movie_companies_company', 'companyId', 'companies', 'id', 'NO ACTION')

    await addFkIfPossible('movie_platforms', 'FK_movie_platforms_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_platforms', 'FK_movie_platforms_platform', 'platformId', 'platforms', 'id', 'NO ACTION')

    await addFkIfPossible('movie_contacts', 'FK_movie_contacts_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_contacts', 'FK_movie_contacts_professional', 'professionalId', 'professionals', 'id', 'NO ACTION')

    await addFkIfPossible('movie_content_bank', 'FK_movie_content_bank_movie', 'movieId', 'movies', 'id', 'CASCADE')

    await addFkIfPossible('movie_funding', 'FK_movie_funding_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_funding', 'FK_movie_funding_fund', 'fundId', 'funds', 'id', 'NO ACTION')

    await addFkIfPossible('movie_festival_nominations', 'FK_movie_festival_nominations_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_festival_nominations', 'FK_movie_festival_nominations_fund', 'fundId', 'funds', 'id', 'NO ACTION')

    await addFkIfPossible('movie_national_releases', 'FK_movie_national_releases_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_national_releases', 'FK_movie_national_releases_space', 'exhibitionSpaceId', 'exhibition_spaces', 'id', 'NO ACTION')
    await addFkIfPossible('movie_national_releases', 'FK_movie_national_releases_city', 'cityId', 'cities', 'id', 'NO ACTION')

    await addFkIfPossible('movie_international_releases', 'FK_movie_international_releases_movie', 'movieId', 'movies', 'id', 'CASCADE')
    await addFkIfPossible('movie_international_releases', 'FK_movie_international_releases_country', 'countryId', 'countries', 'id', 'NO ACTION')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_international_releases"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_national_releases"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_festival_nominations"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_funding"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_content_bank"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_contacts"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_platforms"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_companies"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_professionals"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_frame_assets"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_subgenres"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_provinces"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_cities"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_languages"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "movies"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "cinematic_roles"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "subgenres"`)

    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_content_bank_exhibitionWindow_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_international_releases_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_national_releases_type_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_festival_nominations_result_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_funding_fundingStage_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_companies_participation_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movie_contacts_cargo_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_status_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_projectStatus_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_classification_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_genre_enum"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_type_enum"`)
  }
}
