import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCompaniesTable1775000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'nombre'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "nombre" varchar(255);
          UPDATE "companies" SET "nombre" = COALESCE("legalName", "commercialName", '');
          ALTER TABLE "companies" ALTER COLUMN "nombre" SET NOT NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'representante'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "representante" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'cedulaRepresentante'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "cedulaRepresentante" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'telefono'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "telefono" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'celular'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "celular" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'sitioWeb'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "sitioWeb" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'instagram'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "instagram" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'linkedin'
        ) THEN
          ALTER TABLE "companies" ADD COLUMN "linkedin" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'companies' AND constraint_name = 'UQ_companies_ruc'
        ) THEN
          ALTER TABLE "companies" DROP CONSTRAINT "UQ_companies_ruc";
        END IF;
      END $$;
    `)

    if (await queryRunner.hasColumn('companies', 'ruc')) {
      await queryRunner.query(`
        ALTER TABLE "companies" ALTER COLUMN "ruc" DROP NOT NULL;
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'nombre'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "nombre";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'representante'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "representante";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'cedulaRepresentante'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "cedulaRepresentante";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'telefono'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "telefono";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'celular'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "celular";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'sitioWeb'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "sitioWeb";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'instagram'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "instagram";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'linkedin'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "linkedin";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "companies" ALTER COLUMN "ruc" SET NOT NULL;
    `)

    await queryRunner.query(`
      ALTER TABLE "companies" ADD CONSTRAINT "UQ_companies_ruc" UNIQUE ("ruc");
    `)
  }
}
