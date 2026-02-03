import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePlatformsEntity1769613408179 implements MigrationInterface {
  name = 'UpdatePlatformsEntity1769613408179'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasOwnerIdColumn = await queryRunner.hasColumn('platforms', 'ownerId')
    if (hasOwnerIdColumn) {
      await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "ownerId"`)
    }
    
    const hasNameColumn = await queryRunner.hasColumn('platforms', 'name')
    if (hasNameColumn) {
      await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "name"`)
    }
    
    const hasNameColumnAfter = await queryRunner.hasColumn('platforms', 'name')
    if (!hasNameColumnAfter) {
      await queryRunner.query(`ALTER TABLE "platforms" ADD "name" text NOT NULL`)
    }
    
    const hasTypeColumn = await queryRunner.hasColumn('platforms', 'type')
    if (hasTypeColumn) {
      await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "type"`)
    }
    
    // Eliminar el tipo que exista (puede ser platform_type_enum o platforms_type_enum)
    const platformsTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'platforms_type_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (platformsTypeEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE IF EXISTS "public"."platforms_type_enum"`)
    }
    
    const platformTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'platform_type_enum'
      )
    `)
    if (platformTypeEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE IF EXISTS platform_type_enum`)
    }
    
    const hasTypeColumnFinal = await queryRunner.hasColumn('platforms', 'type')
    if (!hasTypeColumnFinal) {
      await queryRunner.query(
        `ALTER TABLE "platforms" ADD "type" text[] NOT NULL`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "type"`)
    await queryRunner.query(
      `CREATE TYPE "public"."platforms_type_enum" AS ENUM('nacional', 'internacional')`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" "public"."platforms_type_enum" NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "name"`)
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "name" character varying(255) NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" ADD "ownerId" integer`)
  }
}
