import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMissingProfessionalAssetOwnerEnumValues1772300000000 implements MigrationInterface {
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

        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''professional_profile_photo''', enum_name);
        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''professional_portfolio_image''', enum_name);
        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''movie_dossier''', enum_name);
        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''movie_dossier_en''', enum_name);
        EXECUTE format('ALTER TYPE public.%I ADD VALUE IF NOT EXISTS ''movie_pedagogical_guide''', enum_name);
      END $$;
    `)
  }

  public async down(): Promise<void> {
    console.log(
      'Cannot safely remove enum values from PostgreSQL. Manual rollback required if needed.',
    )
  }
}
