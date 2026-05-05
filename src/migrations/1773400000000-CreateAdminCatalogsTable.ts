import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAdminCatalogsTable1773400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        enum_name text;
      BEGIN
        SELECT t.typname
        INTO enum_name
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND t.typname IN ('assets_ownertype_enum', 'asset_owner_enum')
        LIMIT 1;

        IF enum_name IS NULL THEN
          RETURN;
        END IF;

        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''catalog_image''', enum_name);
      END $$;
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "admin_catalogs" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "year" integer NOT NULL,
        "imageId" integer NOT NULL,
        "description" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdById" integer,
        "updatedById" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_catalogs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_catalogs_image" FOREIGN KEY ("imageId") REFERENCES "assets"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_admin_catalogs_createdBy" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_admin_catalogs_updatedBy" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_admin_catalogs_year" ON "admin_catalogs" ("year")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_admin_catalogs_isActive" ON "admin_catalogs" ("isActive")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_admin_catalogs_isActive"`,
    )
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_admin_catalogs_year"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_catalogs"`)

    console.log(
      'Cannot safely remove enum values from PostgreSQL. Manual rollback required if needed.',
    )
  }
}
