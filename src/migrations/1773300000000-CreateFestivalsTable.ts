import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFestivalsTable1773300000000 implements MigrationInterface {
  name = 'CreateFestivalsTable1773300000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasFestivalsTable = await queryRunner.hasTable('festivals')

    if (hasFestivalsTable) {
      return
    }

    await queryRunner.query(`
      CREATE TABLE "festival_types" (
        "id" SERIAL NOT NULL,
        "code" character varying(100) NOT NULL,
        "name" character varying(150) NOT NULL,
        CONSTRAINT "PK_festival_types_id" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_types_code" ON "festival_types" ("code")`,
    )

    await queryRunner.query(`
      INSERT INTO "festival_types" ("code", "name") VALUES
      ('Festival', 'Festival'),
      ('Muestra', 'Muestra'),
      ('Ciclo', 'Ciclo'),
      ('Proyecto de exhibición', 'Proyecto de exhibición'),
      ('Proyecto de distribución', 'Proyecto de distribución')
    `)

    await queryRunner.query(`
      CREATE TABLE "festival_classifications" (
        "id" SERIAL NOT NULL,
        "code" character varying(100) NOT NULL,
        "name" character varying(150) NOT NULL,
        CONSTRAINT "PK_festival_classifications_id" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_classifications_code" ON "festival_classifications" ("code")`,
    )

    await queryRunner.query(`
      INSERT INTO "festival_classifications" ("code", "name") VALUES
      ('general_audience', 'Todo público'),
      ('recommended_0_6', 'Recomendada 0 a 6'),
      ('recommended_6_12', 'Recomendada 6 a 12'),
      ('under_12_supervision', 'Menores de 12 con supervisión'),
      ('over_12', 'Mayores de 12'),
      ('over_15', 'Mayores de 15'),
      ('adults_only_18', 'Solo adultos 18+'),
      ('not_specified', 'No especificado')
    `)

    await queryRunner.query(`
      CREATE TABLE "festivals" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "editionCount" integer NOT NULL,
        "firstEditionYear" integer NOT NULL,
        "typeId" integer NOT NULL,
        "website" character varying(255),
        "theme" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "descriptionEn" text,
        "classificationId" integer NOT NULL,
        "contactName" character varying(255) NOT NULL,
        "contactEmail" character varying(255) NOT NULL,
        "contactPhone" character varying(50) NOT NULL,
        "posterId" integer,
        "trailer" character varying(500),
        "needs" text,
        "needsEn" text,
        "dossierEsId" integer,
        "dossierEnId" integer,
        "hasCall" boolean NOT NULL DEFAULT false,
        "callProcess" text,
        "callLink" character varying(500),
        "createdById" integer,
        "updatedById" integer,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_festivals_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festivals_type" FOREIGN KEY ("typeId") REFERENCES "festival_types"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_festivals_classification" FOREIGN KEY ("classificationId") REFERENCES "festival_classifications"("id") ON DELETE RESTRICT
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "festival_cities" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "cityId" integer NOT NULL,
        "isMainVenue" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_festival_cities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_cities_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_festival_cities_city" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_cities_festival_city" ON "festival_cities" ("festivalId", "cityId")`,
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_cities_main_venue" ON "festival_cities" ("festivalId") WHERE "isMainVenue" = true`,
    )

    await queryRunner.query(`
      CREATE TABLE "festival_modalities" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "value" character varying(50) NOT NULL,
        CONSTRAINT "PK_festival_modalities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_modalities_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_modalities_festival_value" ON "festival_modalities" ("festivalId", "value")`,
    )

    await queryRunner.query(`
      CREATE TABLE "festival_companies" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "companyId" integer NOT NULL,
        CONSTRAINT "PK_festival_companies_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_companies_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_festival_companies_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_companies_festival_company" ON "festival_companies" ("festivalId", "companyId")`,
    )

    await queryRunner.query(`
      CREATE TYPE "festival_professionals_role_enum" AS ENUM ('director', 'producer', 'programmer')
    `)

    await queryRunner.query(`
      CREATE TABLE "festival_professionals" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "professionalId" integer NOT NULL,
        "role" "festival_professionals_role_enum" NOT NULL,
        CONSTRAINT "PK_festival_professionals_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_professionals_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_festival_professionals_professional" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_professionals_festival_prof_role" ON "festival_professionals" ("festivalId", "professionalId", "role")`,
    )

    await queryRunner.query(`
      CREATE TABLE "festival_stills" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "assetId" integer NOT NULL,
        CONSTRAINT "PK_festival_stills_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_stills_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_festival_stills_asset" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT
      )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_festival_stills_festival_asset" ON "festival_stills" ("festivalId", "assetId")`,
    )

    await queryRunner.query(`
      CREATE TABLE "festival_sections" (
        "id" SERIAL NOT NULL,
        "festivalId" integer NOT NULL,
        "name" character varying(255) NOT NULL,
        "competitive" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_festival_sections_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_festival_sections_festival" FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasFestivalsTable = await queryRunner.hasTable('festivals')

    if (!hasFestivalsTable) {
      return
    }

    await queryRunner.query(`DROP TABLE IF EXISTS "festival_sections"`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_stills_festival_asset"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_stills"`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_professionals_festival_prof_role"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_professionals"`)
    await queryRunner.query(
      `DROP TYPE IF EXISTS "festival_professionals_role_enum"`,
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_companies_festival_company"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_companies"`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_modalities_festival_value"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_modalities"`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_cities_main_venue"`,
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_cities_festival_city"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_cities"`)

    await queryRunner.query(`DROP TABLE "festivals"`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "UQ_festival_classifications_code"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_classifications"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_festival_types_code"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "festival_types"`)
  }
}
