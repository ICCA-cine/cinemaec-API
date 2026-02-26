import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class PostBaselineMoviesSchemaUpdates1770000000000
  implements MigrationInterface
{
  name = 'PostBaselineMoviesSchemaUpdates1770000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========================================
    // 1. ADD MOVIE STATUS AND IS_ACTIVE FIELDS
    // ========================================
    const statusColumnExists = await queryRunner.hasColumn('movies', 'status')
    if (!statusColumnExists) {
      await queryRunner.query(
        `ALTER TABLE "movies" ADD COLUMN "status" "public"."movies_status_enum" NOT NULL DEFAULT 'draft'`,
      )
    }

    const isActiveColumnExists = await queryRunner.hasColumn(
      'movies',
      'isActive',
    )
    if (!isActiveColumnExists) {
      await queryRunner.addColumn(
        'movies',
        new TableColumn({
          name: 'isActive',
          type: 'boolean',
          default: false,
          isNullable: false,
        }),
      )
    }

    // ========================================
    // 2. UPDATE MOVIE COMPANIES PARTICIPATION
    // ========================================
    await queryRunner.query(
      `ALTER TABLE "movie_companies" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN IF EXISTS "createdAt"`,
    )

    await queryRunner.query(
      `INSERT INTO "cinematic_roles" ("id", "name") VALUES (20, 'Actor/Actriz')
       ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"`,
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

    // Update funding stage enum
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
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_funding_fundingStage_enum') THEN
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
      `DROP TYPE IF EXISTS "public"."movie_funding_fundingStage_enum_old"`,
    )

    // Update company participation enum
    // NOTE: PostgreSQL does not allow using a newly-added enum value in the same transaction.
    // Convert to text first, remap values, then recreate enum and cast back.
    await queryRunner.query(
      `ALTER TABLE "movie_companies" ALTER COLUMN "participation" TYPE text USING "participation"::text`,
    )
    await queryRunner.query(
      `UPDATE "movie_companies"
       SET "participation" = CASE "participation"
         WHEN 'Productor' THEN 'Producción'
         WHEN 'Coproductor' THEN 'Coproducción'
         ELSE "participation"
       END`,
    )

    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."movie_companies_participation_enum_old"`,
    )
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."movie_companies_participation_enum"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movie_companies_participation_enum" AS ENUM ('Producción', 'Coproducción')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies"
       ALTER COLUMN "participation" TYPE "public"."movie_companies_participation_enum"
       USING (
         CASE "participation"
           WHEN 'Producción' THEN 'Producción'
           WHEN 'Coproducción' THEN 'Coproducción'
           ELSE 'Producción'
         END
       )::"public"."movie_companies_participation_enum"`,
    )

    // Create international coproductions table
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

    // ========================================
    // 3. UPDATE DISTRIBUTION CONTACTS
    // ========================================
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

    // Fix exhibition window column - convert from array to single value
    // Drop the column first (no data in production yet)
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP COLUMN IF EXISTS "exhibitionWindow"`,
    )

    // Ensure the enum exists (already created in baseline migration)
    await queryRunner.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_content_bank_exhibitionWindow_enum') THEN
          CREATE TYPE "public"."movie_content_bank_exhibitionWindow_enum" AS ENUM ('Nacional', 'Internacional', 'VOD');
        END IF;
      END $$;`,
    )

    // Add the column back as non-array
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD COLUMN IF NOT EXISTS "exhibitionWindow" "public"."movie_content_bank_exhibitionWindow_enum" NOT NULL DEFAULT 'Nacional'`,
    )

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

    // Drop foreign key constraint from movie_contacts.professionalId
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
      `DROP TYPE IF EXISTS "public"."movie_contacts_cargo_enum"`,
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
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "role" "public"."movie_contacts_role_enum"`,
    )
    await queryRunner.query(
      `UPDATE "movie_contacts" SET "role" = 'Director/a' WHERE "role" IS NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ALTER COLUMN "role" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "phone" character varying(50)`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    )

    // ========================================
    // 4. RESTRUCTURE PROFESSIONALS
    // ========================================
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "professionals" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(255) NOT NULL DEFAULT 'N/A',
        "dniNumber" character varying(20),
        "phone" character varying(20),
        "mobile" character varying(10),
        "website" character varying(255),
        "linkedin" character varying(255),
        "ownerId" integer,
        "isActive" boolean NOT NULL DEFAULT false,
        "status" character varying(20) NOT NULL DEFAULT 'inactive',
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NULL DEFAULT NULL
      )`,
    )

    const hasProfessionalsTable = await queryRunner.hasTable('professionals')
    if (hasProfessionalsTable) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "name" character varying(255)`,
      )

    // Migrate firstName + lastName to name (only if those columns exist)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'firstName'
        ) THEN
          EXECUTE 'UPDATE "professionals" SET "name" = TRIM(COALESCE("firstName", '''') || '' '' || COALESCE("lastName", '''')) WHERE "name" IS NULL';
        END IF;
      END $$;
    `)

    // Rename idNumber to dniNumber if exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'idNumber'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'dniNumber'
        ) THEN
          ALTER TABLE "professionals" RENAME COLUMN "idNumber" TO "dniNumber";
        END IF;
      END $$;
    `)

    // Add new columns
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "dniNumber" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "phone" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "ownerId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "status" character varying(20) DEFAULT 'inactive'`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NULL DEFAULT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "mobile" character varying(10)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "website" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "linkedin" character varying(255)`,
    )

    // Migrate old Spanish column names (only if they exist)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'nombre'
        ) THEN
          EXECUTE 'UPDATE "professionals" SET "name" = COALESCE(NULLIF("name", ''''), "nombre") WHERE "name" IS NULL OR TRIM("name") = ''''';
        END IF;
      END $$;
    `)

    // Drop old columns
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "firstName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "lastName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "gender"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "email"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "nombre"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "cedula"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "cedulaDni"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "telefono"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "celular"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "sitioWeb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "linkedIn"`,
    )

    // Set defaults for name
    await queryRunner.query(
      `UPDATE "professionals" SET "name" = 'N/A' WHERE "name" IS NULL OR TRIM("name") = ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "name" SET NOT NULL`,
    )

    // Drop old enum types
      await queryRunner.query(
        `DROP TYPE IF EXISTS "public"."professionals_status_enum"`,
      )
    }

    // ========================================
    // 5. RESTRUCTURE COMPANIES
    // ========================================
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "companies" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(255) NOT NULL DEFAULT 'N/A',
        "ruc" character varying(13),
        "representative" character varying(255),
        "representativeDniNumber" character varying(20),
        "phone" character varying(20),
        "mobile" character varying(10),
        "website" character varying(255),
        "instagram" character varying(255),
        "linkedin" character varying(255),
        "ownerId" integer,
        "isActive" boolean NOT NULL DEFAULT false,
        "status" character varying(20) NOT NULL DEFAULT 'inactive',
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NULL DEFAULT NULL
      )`,
    )

    const hasCompaniesTable = await queryRunner.hasTable('companies')
    if (hasCompaniesTable) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "name" character varying(255)`,
      )

    // Migrate commercialName or legalName to name (only if those columns exist)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'commercialName'
        ) THEN
          EXECUTE 'UPDATE "companies" SET "name" = COALESCE(NULLIF("commercialName", ''''), NULLIF("legalName", '''')) WHERE "name" IS NULL';
        END IF;
      END $$;
    `)

    // Rename representativeIdNumber to representativeDniNumber if exists
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'representativeIdNumber'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'representativeDniNumber'
        ) THEN
          ALTER TABLE "companies" RENAME COLUMN "representativeIdNumber" TO "representativeDniNumber";
        END IF;
      END $$;
    `)

    // Add new columns
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "representative" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "phone" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "ownerId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "status" character varying(20) DEFAULT 'inactive'`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NULL DEFAULT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "representativeDniNumber" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "mobile" character varying(10)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "instagram" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "linkedin" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "website" character varying(255)`,
    )

    // Update RUC column
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ruc" TYPE character varying(13)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ruc" DROP NOT NULL`,
    )

    // Set NOT NULL for createdAt
    await queryRunner.query(
      `UPDATE "companies" SET "createdAt" = now() WHERE "createdAt" IS NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "createdAt" SET NOT NULL`,
    )

    // Drop old columns
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "countryId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "email"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "legalName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "commercialName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "nombre"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "representante"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "cedulaRepresentante"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "telefono"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "celular"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "sitioWeb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "linkedIn"`,
    )

    // Set defaults for name
    await queryRunner.query(
      `UPDATE "companies" SET "name" = 'N/A' WHERE "name" IS NULL OR TRIM("name") = ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "name" SET NOT NULL`,
    )

    // Drop old enum types
      await queryRunner.query(
        `DROP TYPE IF EXISTS "public"."companies_status_enum"`,
      )
    }

    // ========================================
    // 6. ADD NO_ESPECIFICADA CLASSIFICATION
    // ========================================
    await queryRunner.query(
      `ALTER TYPE "public"."movies_classification_enum" ADD VALUE IF NOT EXISTS 'no_especificada'`,
    )

    // ========================================
    // 7. FIX ALL SEQUENCES
    // ========================================
    const tables = [
      'professionals',
      'companies',
      'provinces',
      'cities',
      'cinematic_roles',
      'languages',
      'subgenres',
    ]

    for (const table of tables) {
      try {
        await queryRunner.query(`
          SELECT setval(
            '${table}_id_seq',
            COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
            true
          )
        `)
      } catch {
        // Sequence might not exist, continue
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Rollback is complex and not needed for production
    // This migration consolidates multiple migrations that have already been applied
    throw new Error(
      'This migration cannot be rolled back. It consolidates multiple migrations.',
    )
  }
}
