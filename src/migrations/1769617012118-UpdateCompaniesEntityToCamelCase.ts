import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCompaniesEntityToCamelCase1769617012118
  implements MigrationInterface
{
  name = 'UpdateCompaniesEntityToCamelCase1769617012118'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_c0b822f1f2592917b52bd7368ba"`,
    )
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "country_id"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "created_at"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "owner_id"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "nombreLegal"`)
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN "nombreComercial"`,
    )
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "telefono"`)
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "legalName" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "commercialName" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "countryId" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "phone" character varying(20)`,
    )
    await queryRunner.query(`ALTER TABLE "companies" ADD "ownerId" integer`)
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_e6a07e7c93441cb849803deb3d2" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT "FK_e6a07e7c93441cb849803deb3d2"`,
    )
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "createdAt"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "ownerId"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "phone"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "countryId"`)
    await queryRunner.query(
      `ALTER TABLE "companies" DROP COLUMN "commercialName"`,
    )
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "legalName"`)
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "telefono" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "nombreComercial" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "nombreLegal" character varying(255)`,
    )
    await queryRunner.query(`ALTER TABLE "companies" ADD "owner_id" integer`)
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "country_id" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_c0b822f1f2592917b52bd7368ba" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
