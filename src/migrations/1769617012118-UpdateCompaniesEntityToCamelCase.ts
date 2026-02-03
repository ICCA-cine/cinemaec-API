import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCompaniesEntityToCamelCase1769617012118
  implements MigrationInterface
{
  name = 'UpdateCompaniesEntityToCamelCase1769617012118'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop old FK constraint if it exists (safe operation with try-catch)
    try {
      await queryRunner.query(
        `ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "FK_c0b822f1f2592917b52bd7368ba"`,
      )
    } catch (error) {
      // Constraint might not exist, continue
    }

    const hasCountryIdOld = await queryRunner.hasColumn('companies', 'country_id')
    if (hasCountryIdOld) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "country_id"`)
    }
    const hasCreatedAtOld = await queryRunner.hasColumn('companies', 'created_at')
    if (hasCreatedAtOld) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "created_at"`)
    }
    const hasUpdatedAtOld = await queryRunner.hasColumn('companies', 'updated_at')
    if (hasUpdatedAtOld) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updated_at"`)
    }
    const hasOwnerIdOld = await queryRunner.hasColumn('companies', 'owner_id')
    if (hasOwnerIdOld) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "owner_id"`)
    }
    const hasNombreLegal = await queryRunner.hasColumn('companies', 'nombreLegal')
    if (hasNombreLegal) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "nombreLegal"`)
    }
    const hasNombreComercial = await queryRunner.hasColumn('companies', 'nombreComercial')
    if (hasNombreComercial) {
      await queryRunner.query(
        `ALTER TABLE "companies" DROP COLUMN "nombreComercial"`,
      )
    }
    const hasTelefono = await queryRunner.hasColumn('companies', 'telefono')
    if (hasTelefono) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "telefono"`)
    }

    const hasLegalName = await queryRunner.hasColumn('companies', 'legalName')
    if (!hasLegalName) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "legalName" character varying(255)`,
      )
    }
    const hasCommercialName = await queryRunner.hasColumn('companies', 'commercialName')
    if (!hasCommercialName) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "commercialName" character varying(255)`,
      )
    }
    const hasCountryId = await queryRunner.hasColumn('companies', 'countryId')
    if (!hasCountryId) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "countryId" integer NOT NULL`,
      )
    }
    const hasPhone = await queryRunner.hasColumn('companies', 'phone')
    if (!hasPhone) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "phone" character varying(20)`,
      )
    }
    const hasOwnerId = await queryRunner.hasColumn('companies', 'ownerId')
    if (!hasOwnerId) {
      await queryRunner.query(`ALTER TABLE "companies" ADD "ownerId" integer`)
    }
    const hasCreatedAt = await queryRunner.hasColumn('companies', 'createdAt')
    if (!hasCreatedAt) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
      )
    }
    const hasUpdatedAt = await queryRunner.hasColumn('companies', 'updatedAt')
    if (!hasUpdatedAt) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
      )
    }

    const newFkExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'FK_e6a07e7c93441cb849803deb3d2'
        AND table_name = 'companies'
      )
    `)
    if (!newFkExists[0].exists) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD CONSTRAINT "FK_e6a07e7c93441cb849803deb3d2" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new FK constraint if it exists
    try {
      await queryRunner.query(
        `ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "FK_e6a07e7c93441cb849803deb3d2"`,
      )
    } catch (error) {
      // Constraint might not exist, continue
    }

    const hasUpdatedAt = await queryRunner.hasColumn('companies', 'updatedAt')
    if (hasUpdatedAt) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updatedAt"`)
    }
    const hasCreatedAt = await queryRunner.hasColumn('companies', 'createdAt')
    if (hasCreatedAt) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "createdAt"`)
    }
    const hasOwnerId = await queryRunner.hasColumn('companies', 'ownerId')
    if (hasOwnerId) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "ownerId"`)
    }
    const hasPhone = await queryRunner.hasColumn('companies', 'phone')
    if (hasPhone) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "phone"`)
    }
    const hasCountryId = await queryRunner.hasColumn('companies', 'countryId')
    if (hasCountryId) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "countryId"`)
    }
    const hasCommercialName = await queryRunner.hasColumn('companies', 'commercialName')
    if (hasCommercialName) {
      await queryRunner.query(
        `ALTER TABLE "companies" DROP COLUMN "commercialName"`,
      )
    }
    const hasLegalName = await queryRunner.hasColumn('companies', 'legalName')
    if (hasLegalName) {
      await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "legalName"`)
    }

    const hasTelefono = await queryRunner.hasColumn('companies', 'telefono')
    if (!hasTelefono) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "telefono" character varying(20)`,
      )
    }
    const hasNombreComercial = await queryRunner.hasColumn('companies', 'nombreComercial')
    if (!hasNombreComercial) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "nombreComercial" character varying(255)`,
      )
    }
    const hasNombreLegal = await queryRunner.hasColumn('companies', 'nombreLegal')
    if (!hasNombreLegal) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "nombreLegal" character varying(255)`,
      )
    }
    const hasOwnerIdOld = await queryRunner.hasColumn('companies', 'owner_id')
    if (!hasOwnerIdOld) {
      await queryRunner.query(`ALTER TABLE "companies" ADD "owner_id" integer`)
    }
    const hasUpdatedAtOld = await queryRunner.hasColumn('companies', 'updated_at')
    if (!hasUpdatedAtOld) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
      )
    }
    const hasCreatedAtOld = await queryRunner.hasColumn('companies', 'created_at')
    if (!hasCreatedAtOld) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
      )
    }
    const hasCountryIdOld = await queryRunner.hasColumn('companies', 'country_id')
    if (!hasCountryIdOld) {
      await queryRunner.query(
        `ALTER TABLE "companies" ADD "country_id" integer NOT NULL`,
      )
    }

    const oldFkExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'FK_c0b822f1f2592917b52bd7368ba'
        AND table_name = 'companies'
      )
    `)
    if (!oldFkExists[0].exists) {
      try {
        await queryRunner.query(
          `ALTER TABLE "companies" ADD CONSTRAINT "FK_c0b822f1f2592917b52bd7368ba" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
      } catch (error) {
        // Constraint might already exist, continue
      }
    }
  }
}
