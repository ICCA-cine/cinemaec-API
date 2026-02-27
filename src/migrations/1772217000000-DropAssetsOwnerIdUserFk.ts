import { MigrationInterface, QueryRunner } from 'typeorm'

export class DropAssetsOwnerIdUserFk1772217000000
  implements MigrationInterface
{
  name = 'DropAssetsOwnerIdUserFk1772217000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        fk_record RECORD;
      BEGIN
        FOR fk_record IN
          SELECT tc.constraint_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
           AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = 'assets'
            AND kcu.column_name = 'ownerId'
            AND ccu.table_name = 'users'
            AND ccu.column_name = 'id'
        LOOP
          EXECUTE format('ALTER TABLE "assets" DROP CONSTRAINT IF EXISTS %I', fk_record.constraint_name);
        END LOOP;
      END$$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
           AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = 'assets'
            AND kcu.column_name = 'ownerId'
            AND ccu.table_name = 'users'
            AND ccu.column_name = 'id'
        ) THEN
          ALTER TABLE "assets"
          ADD CONSTRAINT "FK_assets_ownerId_users"
          FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL;
        END IF;
      END$$;
    `)
  }
}
