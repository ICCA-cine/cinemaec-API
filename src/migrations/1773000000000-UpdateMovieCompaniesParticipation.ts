import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateMovieCompaniesParticipation1773000000000
  implements MigrationInterface
{
  name = 'UpdateMovieCompaniesParticipation1773000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_companies" DROP COLUMN IF EXISTS "createdAt"`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN IF EXISTS "createdAt"`,
    )

    await queryRunner.query(
      `INSERT INTO "cinematic_roles" ("id", "name") VALUES (20, 'Actor/Actriz') ON CONFLICT ("name") DO NOTHING`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movie_filming_countries" (
        "id" SERIAL NOT NULL,
        "movieId" integer NOT NULL,
        "countryId" integer NOT NULL,
        CONSTRAINT "PK_movie_filming_countries" PRIMARY KEY ("id")
      )`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_filming_countries" ADD CONSTRAINT "FK_movie_filming_countries_movie" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_filming_countries" ADD CONSTRAINT "FK_movie_filming_countries_country" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingstage_enum') THEN
          ALTER TYPE "public"."movie_funding_fundingstage_enum" RENAME TO "movie_funding_fundingStage_enum_old";
        ELSIF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum') THEN
          ALTER TYPE "public"."movie_funding_fundingStage_enum" RENAME TO "movie_funding_fundingStage_enum_old";
        END IF;
      END $$;`,
    )
    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum')
           AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingstage_enum') THEN
          CREATE TYPE "public"."movie_funding_fundingStage_enum" AS ENUM ('desarrollo', 'produccion', 'postproduccion', 'distribucion', 'finalizado');
        END IF;
      END $$;`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_funding" ALTER COLUMN "fundingStage" TYPE "public"."movie_funding_fundingStage_enum" USING (
        CASE "fundingStage"::text
          WHEN 'Desarrollo' THEN 'desarrollo'
          WHEN 'Producción' THEN 'produccion'
          WHEN 'Postproducción' THEN 'postproduccion'
          WHEN 'Distribución' THEN 'distribucion'
          WHEN 'desarrollo' THEN 'desarrollo'
          WHEN 'produccion' THEN 'produccion'
          WHEN 'postproduccion' THEN 'postproduccion'
          WHEN 'distribucion' THEN 'distribucion'
          WHEN 'finalizado' THEN 'finalizado'
          ELSE 'desarrollo'
        END
      )::"public"."movie_funding_fundingStage_enum"`,
    )
    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum_old') THEN
          DROP TYPE "public"."movie_funding_fundingStage_enum_old";
        END IF;
      END $$;`,
    )

    await queryRunner.query(
      `ALTER TYPE "public"."movie_companies_participation_enum" ADD VALUE IF NOT EXISTS 'Producción'`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."movie_companies_participation_enum" ADD VALUE IF NOT EXISTS 'Coproducción'`,
    )

    await queryRunner.query(
      `UPDATE "movie_companies" SET "participation" = 'Producción' WHERE "participation"::text = 'Productor'`,
    )
    await queryRunner.query(
      `UPDATE "movie_companies" SET "participation" = 'Coproducción' WHERE "participation"::text = 'Coproductor'`,
    )

    await queryRunner.query(
      `ALTER TYPE "public"."movie_companies_participation_enum" RENAME TO "movie_companies_participation_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movie_companies_participation_enum" AS ENUM ('Producción', 'Coproducción')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies" ALTER COLUMN "participation" TYPE "public"."movie_companies_participation_enum" USING "participation"::text::"public"."movie_companies_participation_enum"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."movie_companies_participation_enum_old"`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_international_coproductions" (
        "id" SERIAL NOT NULL,
        "movieId" integer NOT NULL,
        "companyName" character varying(255) NOT NULL,
        "countryId" integer NOT NULL,
        CONSTRAINT "PK_movies_international_coproductions" PRIMARY KEY ("id")
      )`,
    )

    await queryRunner.query(
      `ALTER TABLE "movies_international_coproductions" ADD CONSTRAINT "FK_movies_international_coproductions_movie" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_international_coproductions" ADD CONSTRAINT "FK_movies_international_coproductions_country" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies_international_coproductions" DROP CONSTRAINT IF EXISTS "FK_movies_international_coproductions_country"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_international_coproductions" DROP CONSTRAINT IF EXISTS "FK_movies_international_coproductions_movie"`,
    )
    await queryRunner.query(
      `DROP TABLE IF EXISTS "movies_international_coproductions"`,
    )

    await queryRunner.query(
      `CREATE TYPE "public"."movie_companies_participation_enum_old" AS ENUM ('Productor', 'Coproductor')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies" ALTER COLUMN "participation" TYPE "public"."movie_companies_participation_enum_old" USING "participation"::text::"public"."movie_companies_participation_enum_old"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."movie_companies_participation_enum"`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."movie_companies_participation_enum_old" RENAME TO "movie_companies_participation_enum"`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_companies" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_filming_countries" DROP CONSTRAINT IF EXISTS "FK_movie_filming_countries_country"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_filming_countries" DROP CONSTRAINT IF EXISTS "FK_movie_filming_countries_movie"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_filming_countries"`)

    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum_old') THEN
          CREATE TYPE "public"."movie_funding_fundingStage_enum_old" AS ENUM ('Desarrollo', 'Producción', 'Postproducción', 'Distribución');
        END IF;
      END $$;`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_funding" ALTER COLUMN "fundingStage" TYPE "public"."movie_funding_fundingStage_enum_old" USING (
        CASE "fundingStage"::text
          WHEN 'desarrollo' THEN 'Desarrollo'
          WHEN 'produccion' THEN 'Producción'
          WHEN 'postproduccion' THEN 'Postproducción'
          WHEN 'distribucion' THEN 'Distribución'
          WHEN 'finalizado' THEN 'Desarrollo'
          WHEN 'Desarrollo' THEN 'Desarrollo'
          WHEN 'Producción' THEN 'Producción'
          WHEN 'Postproducción' THEN 'Postproducción'
          WHEN 'Distribución' THEN 'Distribución'
          ELSE 'Desarrollo'
        END
      )::"public"."movie_funding_fundingStage_enum_old"`,
    )
    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum') THEN
          DROP TYPE "public"."movie_funding_fundingStage_enum";
        ELSIF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingstage_enum') THEN
          DROP TYPE "public"."movie_funding_fundingstage_enum";
        END IF;
      END $$;`,
    )
    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum_old') THEN
          ALTER TYPE "public"."movie_funding_fundingStage_enum_old" RENAME TO "movie_funding_fundingStage_enum";
        END IF;
      END $$;`,
    )

    await queryRunner.query(
      `DELETE FROM "cinematic_roles" WHERE "name" = 'Actor/Actriz'`,
    )
  }
}
