import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateDistributionContacts1774000000000
  implements MigrationInterface
{
  name = 'UpdateDistributionContacts1774000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "createdAt"`,
    )

    await queryRunner.query(`DROP TABLE IF EXISTS "movies_provinces"`)

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_subtitles" (
        "id" SERIAL NOT NULL,
        "movieId" integer NOT NULL,
        "languageId" integer NOT NULL,
        CONSTRAINT "PK_movies_subtitles" PRIMARY KEY ("id")
      )`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subtitles" ADD CONSTRAINT "FK_movies_subtitles_movie" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subtitles" ADD CONSTRAINT "FK_movies_subtitles_language" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ALTER COLUMN "exhibitionWindow" TYPE "public"."movie_content_bank_exhibitionWindow_enum" USING (
        CASE
          WHEN "exhibitionWindow" IS NULL THEN 'Nacional'
          ELSE "exhibitionWindow"[1]
        END
      )::"public"."movie_content_bank_exhibitionWindow_enum"`,
    )

    await queryRunner.query(
      `DO $$
      DECLARE constraint_name text;
      BEGIN
        SELECT conname INTO constraint_name
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
        WHERE t.relname = 'movie_contacts'
          AND a.attname = 'professionalId'
          AND c.contype = 'f';
        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE "movie_contacts" DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "professionalId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "cargo"`,
    )

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_contacts_cargo_enum') THEN
          DROP TYPE "public"."movie_contacts_cargo_enum";
        END IF;
      END $$;`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "name" character varying(255)`,
    )
    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_contacts_role_enum') THEN
          CREATE TYPE "public"."movie_contacts_role_enum" AS ENUM ('Director/a', 'Productor/a', 'Agente de ventas', 'Distribuidor/a');
        END IF;
      END $$;`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "role" "public"."movie_contacts_role_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "phone" character varying(50)`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "email"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "phone"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "role"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP COLUMN IF EXISTS "name"`,
    )

    await queryRunner.query(
      `DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_contacts_role_enum') THEN
          DROP TYPE "public"."movie_contacts_role_enum";
        END IF;
      END $$;`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "cargo" character varying(50) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "professionalId" integer NOT NULL`,
    )

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "movies_provinces" (
        "movieId" integer NOT NULL,
        "provinceId" integer NOT NULL,
        PRIMARY KEY ("movieId", "provinceId")
      )`,
    )

    await queryRunner.query(
      `ALTER TABLE "movies_subtitles" DROP CONSTRAINT IF EXISTS "FK_movies_subtitles_language"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subtitles" DROP CONSTRAINT IF EXISTS "FK_movies_subtitles_movie"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_subtitles"`)

    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ALTER COLUMN "exhibitionWindow" TYPE "public"."movie_content_bank_exhibitionWindow_enum"[] USING (
        CASE
          WHEN "exhibitionWindow" IS NULL THEN ARRAY['Nacional']::"public"."movie_content_bank_exhibitionWindow_enum"[]
          ELSE ARRAY["exhibitionWindow"]::"public"."movie_content_bank_exhibitionWindow_enum"[]
        END
      )`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }
}
