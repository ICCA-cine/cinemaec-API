import { MigrationInterface, QueryRunner } from 'typeorm'

export class CleanupProfessionalsAndCompanies1775000000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clean up Professionals table
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'firstName'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "firstName";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'lastName'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "lastName";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'idNumber'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "idNumber";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'email'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "email";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'phone'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "phone";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'status'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "status";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'professionals' AND column_name = 'updatedAt'
        ) THEN
          ALTER TABLE "professionals" DROP COLUMN "updatedAt";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'professionals' AND constraint_name LIKE '%gender%'
        ) THEN
          DROP TYPE IF EXISTS professionals_gender;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'professionals' AND constraint_name LIKE '%status%'
        ) THEN
          DROP TYPE IF EXISTS professionals_status;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "professionals" ALTER COLUMN "isActive" SET DEFAULT false;
    `)

    // Clean up Companies table
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'legalName'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "legalName";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'commercialName'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "commercialName";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'email'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "email";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'phone'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "phone";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'website'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "website";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'status'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "status";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'companies' AND column_name = 'updatedAt'
        ) THEN
          ALTER TABLE "companies" DROP COLUMN "updatedAt";
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      ALTER TABLE "companies" ALTER COLUMN "isActive" SET DEFAULT false;
    `)

    // Drop enum types if they exist
    await queryRunner.query(`
      DO $$ BEGIN
        DROP TYPE IF EXISTS companies_status;
      END $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert would require recreating the columns - skipping for now as this is a cleanup
  }
}
