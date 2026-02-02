import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePlatformTypeEnum1769632639312 implements MigrationInterface {
  name = 'UpdatePlatformTypeEnum1769632639312'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "type"`)
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "platforms" ALTER COLUMN "updatedAt" SET NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "type"`)
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" text[] NOT NULL`,
    )
  }
}
