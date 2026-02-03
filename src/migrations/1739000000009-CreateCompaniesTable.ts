import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCompaniesTable1739000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('companies')
    if (hasTable) {
      return
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "companies" (
        "id" SERIAL PRIMARY KEY,
        "ruc" varchar(20) UNIQUE NOT NULL,
        "nombre_legal" varchar(255),
        "nombre_comercial" varchar(255),
        "country_id" integer NOT NULL,
        "email" varchar(255),
        "telefono" varchar(20),
        "website" varchar(255),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "fk_companies_country" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_companies_ruc" ON "companies"("ruc")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_companies_country" ON "companies"("country_id")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_companies_nombre_comercial" ON "companies"("nombre_comercial")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_companies_nombre_comercial"`)
    await queryRunner.query(`DROP INDEX "idx_companies_country"`)
    await queryRunner.query(`DROP INDEX "idx_companies_ruc"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "companies"`)
  }
}
