import { MigrationInterface, QueryRunner } from 'typeorm'

export class NormalizeFestivalsSchema1784000000000
  implements MigrationInterface
{
  name = 'NormalizeFestivalsSchema1784000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasFestivalsTable = await queryRunner.hasTable('festivals')

    if (!hasFestivalsTable) {
      return
    }

    // 1. Create lookup tables if they don't exist
    const hasFestivalTypesTable = await queryRunner.hasTable('festival_types')
    if (!hasFestivalTypesTable) {
      await queryRunner.query(`
        CREATE TABLE "festival_types" (
          "id" SERIAL NOT NULL,
          "code" character varying(100) NOT NULL,
          "name" character varying(150) NOT NULL,
          CONSTRAINT "PK_festival_types_id" PRIMARY KEY ("id")
        )
      `)
    }

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_festival_types_code" ON "festival_types" ("code")`,
    )

    await queryRunner.query(`
      INSERT INTO "festival_types" ("code", "name") VALUES
      ('Festival', 'Festival'),
      ('Muestra', 'Muestra'),
      ('Ciclo', 'Ciclo'),
      ('Proyecto de exhibición', 'Proyecto de exhibición'),
      ('Proyecto de distribución', 'Proyecto de distribución')
      ON CONFLICT ("code") DO NOTHING
    `)

    const hasFestivalClassificationsTable = await queryRunner.hasTable(
      'festival_classifications',
    )
    if (!hasFestivalClassificationsTable) {
      await queryRunner.query(`
        CREATE TABLE "festival_classifications" (
          "id" SERIAL NOT NULL,
          "code" character varying(100) NOT NULL,
          "name" character varying(150) NOT NULL,
          CONSTRAINT "PK_festival_classifications_id" PRIMARY KEY ("id")
        )
      `)
    }

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_festival_classifications_code" ON "festival_classifications" ("code")`,
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
      ON CONFLICT ("code") DO NOTHING
    `)

    // 2. Add typeId / classificationId columns if they don't exist
    const festivalsTable = await queryRunner.getTable('festivals')
    if (!festivalsTable) return

    if (!festivalsTable.findColumnByName('typeId')) {
      await queryRunner.query(
        `ALTER TABLE "festivals" ADD COLUMN "typeId" integer`,
      )
    }

    if (!festivalsTable.findColumnByName('classificationId')) {
      await queryRunner.query(
        `ALTER TABLE "festivals" ADD COLUMN "classificationId" integer`,
      )
    }

    // 3. Backfill from legacy varchar columns if they exist
    if (festivalsTable.findColumnByName('type')) {
      await queryRunner.query(`
        UPDATE "festivals" f
        SET "typeId" = ft."id"
        FROM "festival_types" ft
        WHERE f."typeId" IS NULL
          AND (ft."code" = f."type" OR ft."name" = f."type")
      `)
    }

    // Default fallback for rows that couldn't be matched
    await queryRunner.query(`
      UPDATE "festivals"
      SET "typeId" = (
        SELECT "id" FROM "festival_types" WHERE "code" = 'Festival' LIMIT 1
      )
      WHERE "typeId" IS NULL
    `)

    if (festivalsTable.findColumnByName('classification')) {
      await queryRunner.query(`
        UPDATE "festivals" f
        SET "classificationId" = fc."id"
        FROM "festival_classifications" fc
        WHERE f."classificationId" IS NULL
          AND (fc."code" = f."classification" OR fc."name" = f."classification")
      `)
    }

    // Default fallback for rows that couldn't be matched
    await queryRunner.query(`
      UPDATE "festivals"
      SET "classificationId" = (
        SELECT "id" FROM "festival_classifications" WHERE "code" = 'not_specified' LIMIT 1
      )
      WHERE "classificationId" IS NULL
    `)

    // 4. Set NOT NULL constraints
    await queryRunner.query(
      `ALTER TABLE "festivals" ALTER COLUMN "typeId" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "festivals" ALTER COLUMN "classificationId" SET NOT NULL`,
    )

    // 5. Add FK constraints if they don't exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_festivals_type'
        ) THEN
          ALTER TABLE "festivals"
          ADD CONSTRAINT "FK_festivals_type"
          FOREIGN KEY ("typeId") REFERENCES "festival_types"("id")
          ON DELETE RESTRICT;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FK_festivals_classification'
        ) THEN
          ALTER TABLE "festivals"
          ADD CONSTRAINT "FK_festivals_classification"
          FOREIGN KEY ("classificationId") REFERENCES "festival_classifications"("id")
          ON DELETE RESTRICT;
        END IF;
      END $$;
    `)

    // 6. Drop legacy varchar columns if they exist
    const updatedTable = await queryRunner.getTable('festivals')
    if (!updatedTable) return

    if (updatedTable.findColumnByName('type')) {
      await queryRunner.query(`ALTER TABLE "festivals" DROP COLUMN "type"`)
    }

    if (updatedTable.findColumnByName('classification')) {
      await queryRunner.query(
        `ALTER TABLE "festivals" DROP COLUMN "classification"`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const festivalsTable = await queryRunner.getTable('festivals')
    if (!festivalsTable) return

    if (!festivalsTable.findColumnByName('type')) {
      await queryRunner.query(
        `ALTER TABLE "festivals" ADD COLUMN "type" character varying(100)`,
      )
      await queryRunner.query(`
        UPDATE "festivals" f
        SET "type" = ft."code"
        FROM "festival_types" ft
        WHERE ft."id" = f."typeId"
      `)
      await queryRunner.query(
        `ALTER TABLE "festivals" ALTER COLUMN "type" SET NOT NULL`,
      )
    }

    if (!festivalsTable.findColumnByName('classification')) {
      await queryRunner.query(
        `ALTER TABLE "festivals" ADD COLUMN "classification" character varying(100)`,
      )
      await queryRunner.query(`
        UPDATE "festivals" f
        SET "classification" = fc."code"
        FROM "festival_classifications" fc
        WHERE fc."id" = f."classificationId"
      `)
      await queryRunner.query(
        `ALTER TABLE "festivals" ALTER COLUMN "classification" SET NOT NULL`,
      )
    }

    await queryRunner.query(
      `ALTER TABLE "festivals" DROP CONSTRAINT IF EXISTS "FK_festivals_type"`,
    )
    await queryRunner.query(
      `ALTER TABLE "festivals" DROP CONSTRAINT IF EXISTS "FK_festivals_classification"`,
    )
    await queryRunner.query(
      `ALTER TABLE "festivals" DROP COLUMN IF EXISTS "typeId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "festivals" DROP COLUMN IF EXISTS "classificationId"`,
    )
  }
}
