import { MigrationInterface, QueryRunner } from 'typeorm'

export class NormalizeLegacyCatalogColumnNames1772400000000
  implements MigrationInterface
{
  name = 'NormalizeLegacyCatalogColumnNames1772400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'nombre'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'name'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "nombre" TO "name";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'tipo'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'type'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "tipo" TO "type";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'origenFinanciero'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'financialOrigin'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "origenFinanciero" TO "financialOrigin";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'nombre'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'name'
        ) THEN
          ALTER TABLE "platforms" RENAME COLUMN "nombre" TO "name";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'tipo'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'type'
        ) THEN
          ALTER TABLE "platforms" RENAME COLUMN "tipo" TO "type";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'exhibition_spaces'
            AND column_name = 'nombre'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'exhibition_spaces'
            AND column_name = 'name'
        ) THEN
          ALTER TABLE "exhibition_spaces" RENAME COLUMN "nombre" TO "name";
        END IF;
      END
      $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'name'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'nombre'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "name" TO "nombre";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'type'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'tipo'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "type" TO "tipo";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'financialOrigin'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'funds'
            AND column_name = 'origenFinanciero'
        ) THEN
          ALTER TABLE "funds" RENAME COLUMN "financialOrigin" TO "origenFinanciero";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'name'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'nombre'
        ) THEN
          ALTER TABLE "platforms" RENAME COLUMN "name" TO "nombre";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'type'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'platforms'
            AND column_name = 'tipo'
        ) THEN
          ALTER TABLE "platforms" RENAME COLUMN "type" TO "tipo";
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'exhibition_spaces'
            AND column_name = 'name'
        )
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'exhibition_spaces'
            AND column_name = 'nombre'
        ) THEN
          ALTER TABLE "exhibition_spaces" RENAME COLUMN "name" TO "nombre";
        END IF;
      END
      $$;
    `)
  }
}
