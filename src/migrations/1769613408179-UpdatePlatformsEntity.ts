import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePlatformsEntity1769613408179 implements MigrationInterface {
  name = 'UpdatePlatformsEntity1769613408179'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "ownerId"`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "name"`)
    await queryRunner.query(`ALTER TABLE "platforms" ADD "name" text NOT NULL`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."platforms_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" text[] NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "type"`)
    await queryRunner.query(
      `CREATE TYPE "public"."platforms_type_enum" AS ENUM('nacional', 'internacional')`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" "public"."platforms_type_enum" NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "name"`)
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "name" character varying(255) NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" ADD "ownerId" integer`)
  }
}
