import { MigrationInterface, QueryRunner } from 'typeorm'

export class RestructureProfessionalsAndCompanies1775000000000
  implements MigrationInterface
{
  name = 'RestructureProfessionalsAndCompanies1775000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "name" character varying(255)`,
    )

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'firstName'
        ) THEN
          UPDATE "professionals"
          SET "name" = TRIM(COALESCE("firstName", '') || ' ' || COALESCE("lastName", ''))
          WHERE "name" IS NULL;
        END IF;
      END $$;
    `)

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

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'nombre'
        ) THEN
          UPDATE "professionals"
          SET "name" = COALESCE(NULLIF("name", ''), NULLIF("nombre", ''), "name")
          WHERE "name" IS NULL OR TRIM("name") = '';
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'cedula'
        ) THEN
          UPDATE "professionals"
          SET "dniNumber" = COALESCE("dniNumber", "cedula")
          WHERE "dniNumber" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'cedulaDni'
        ) THEN
          UPDATE "professionals"
          SET "dniNumber" = COALESCE("dniNumber", "cedulaDni")
          WHERE "dniNumber" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'telefono'
        ) THEN
          UPDATE "professionals"
          SET "phone" = COALESCE("phone", "telefono")
          WHERE "phone" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'celular'
        ) THEN
          UPDATE "professionals"
          SET "mobile" = COALESCE("mobile", "celular")
          WHERE "mobile" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'sitioWeb'
        ) THEN
          UPDATE "professionals"
          SET "website" = COALESCE("website", "sitioWeb")
          WHERE "website" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'linkedIn'
        ) THEN
          UPDATE "professionals"
          SET "linkedin" = COALESCE("linkedin", "linkedIn")
          WHERE "linkedin" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "ownerId" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "ownerId" SET DEFAULT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "isActive" SET DEFAULT false`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "status" TYPE character varying(20) USING "status"::text`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "status" SET DEFAULT 'inactive'`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "updatedAt" SET DEFAULT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    )
    await queryRunner.query(
      `UPDATE "professionals" SET "createdAt" = now() WHERE "createdAt" IS NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "createdAt" SET NOT NULL`,
    )

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

    await queryRunner.query(
      `UPDATE "professionals" SET "name" = 'N/A' WHERE "name" IS NULL OR TRIM("name") = ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "name" SET NOT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "name" character varying(255)`,
    )

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'commercialName'
        ) THEN
          UPDATE "companies"
          SET "name" = COALESCE(NULLIF("commercialName", ''), NULLIF("legalName", ''), "name")
          WHERE "name" IS NULL;
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'legalName'
        ) THEN
          UPDATE "companies"
          SET "name" = COALESCE(NULLIF("legalName", ''), "name")
          WHERE "name" IS NULL;
        END IF;
      END $$;
    `)

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

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'nombre'
        ) THEN
          UPDATE "companies"
          SET "name" = COALESCE(NULLIF("name", ''), NULLIF("nombre", ''), "name")
          WHERE "name" IS NULL OR TRIM("name") = '';
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'representante'
        ) THEN
          UPDATE "companies"
          SET "representative" = COALESCE("representative", "representante")
          WHERE "representative" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'cedulaRepresentante'
        ) THEN
          UPDATE "companies"
          SET "representativeDniNumber" = COALESCE("representativeDniNumber", "cedulaRepresentante")
          WHERE "representativeDniNumber" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'telefono'
        ) THEN
          UPDATE "companies"
          SET "phone" = COALESCE("phone", "telefono")
          WHERE "phone" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'celular'
        ) THEN
          UPDATE "companies"
          SET "mobile" = COALESCE("mobile", "celular")
          WHERE "mobile" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'sitioWeb'
        ) THEN
          UPDATE "companies"
          SET "website" = COALESCE("website", "sitioWeb")
          WHERE "website" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'companies' AND column_name = 'linkedIn'
        ) THEN
          UPDATE "companies"
          SET "linkedin" = COALESCE("linkedin", "linkedIn")
          WHERE "linkedin" IS NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ruc" TYPE character varying(13)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ruc" DROP NOT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ownerId" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "ownerId" SET DEFAULT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "isActive" SET DEFAULT false`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "status" TYPE character varying(20) USING "status"::text`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "status" SET DEFAULT 'inactive'`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "updatedAt" SET DEFAULT NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    )
    await queryRunner.query(
      `UPDATE "companies" SET "createdAt" = now() WHERE "createdAt" IS NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "createdAt" SET NOT NULL`,
    )

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

    await queryRunner.query(
      `UPDATE "companies" SET "name" = 'N/A' WHERE "name" IS NULL OR TRIM("name") = ''`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "name" SET NOT NULL`,
    )

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'professionals_status_enum') THEN
          DROP TYPE "public"."professionals_status_enum";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'companies_status_enum') THEN
          DROP TYPE "public"."companies_status_enum";
        END IF;
      END $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'professionals_status_enum') THEN
          CREATE TYPE "public"."professionals_status_enum" AS ENUM ('active', 'inactive', 'verified', 'pending_verification', 'suspended');
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'companies_status_enum') THEN
          CREATE TYPE "public"."companies_status_enum" AS ENUM ('active', 'inactive', 'verified', 'pending_verification', 'rejected');
        END IF;
      END $$;
    `)

    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "countryId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "legalName" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "commercialName" character varying(255)`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "status" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "status" TYPE "public"."companies_status_enum" USING "status"::text::"public"."companies_status_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "status" SET DEFAULT 'active'`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "isActive" SET DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    )

    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "linkedin"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "instagram"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "mobile"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "representativeDniNumber"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "representative"`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN IF EXISTS "name"`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "firstName" character varying(100)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "lastName" character varying(100)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "gender" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    )

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "status" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "status" TYPE "public"."professionals_status_enum" USING "status"::text::"public"."professionals_status_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "status" SET DEFAULT 'active'`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "isActive" SET DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    )

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'dniNumber'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'professionals' AND column_name = 'idNumber'
        ) THEN
          ALTER TABLE "professionals" RENAME COLUMN "dniNumber" TO "idNumber";
        END IF;
      END $$;
    `)

    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "linkedin"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "website"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "mobile"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "name"`,
    )
  }
}
