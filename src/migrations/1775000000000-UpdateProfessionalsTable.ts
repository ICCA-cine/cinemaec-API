import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateProfessionalsTable1775000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'name'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "name" varchar(255);
          UPDATE "professionals" SET "name" = CONCAT(COALESCE("firstName", ''), ' ', COALESCE("lastName", ''));
          ALTER TABLE "professionals" ALTER COLUMN "name" SET NOT NULL;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'cedula'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "cedula" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'telefono'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "telefono" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'celular'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "celular" varchar(20);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'sitioWeb'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "sitioWeb" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'linkedin'
        ) THEN
          ALTER TABLE "professionals" ADD COLUMN "linkedin" varchar(255);
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'professionals' AND constraint_name = 'UQ_professionals_firstName'
        ) THEN
          ALTER TABLE "professionals" DROP CONSTRAINT "UQ_professionals_firstName";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'professionals' AND constraint_name = 'UQ_professionals_lastName'
        ) THEN
          ALTER TABLE "professionals" DROP CONSTRAINT "UQ_professionals_lastName";
        END IF;
      END $$;
    `)

    if (await queryRunner.hasColumn('professionals', 'firstName')) {
      await queryRunner.query(`
        ALTER TABLE "professionals" ALTER COLUMN "firstName" DROP NOT NULL;
      `)
    }

    if (await queryRunner.hasColumn('professionals', 'lastName')) {
      await queryRunner.query(`
        ALTER TABLE "professionals" ALTER COLUMN "lastName" DROP NOT NULL;
      `)
    }

    if (await queryRunner.hasColumn('professionals', 'gender')) {
      await queryRunner.query(`
        ALTER TABLE "professionals" ALTER COLUMN "gender" DROP NOT NULL;
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'name'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "name";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'cedula'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "cedula";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'telefono'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "telefono";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'celular'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "celular";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'sitioWeb'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "sitioWeb";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'linkedin'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "linkedin";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "professionals" 
      ALTER COLUMN "firstName" SET NOT NULL,
      ALTER COLUMN "lastName" SET NOT NULL,
      ALTER COLUMN "gender" SET NOT NULL;
    `)
  }
}
