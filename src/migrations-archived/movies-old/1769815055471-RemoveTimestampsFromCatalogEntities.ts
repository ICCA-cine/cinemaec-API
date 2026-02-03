import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveTimestampsFromCatalogEntities1769815055471
  implements MigrationInterface
{
  name = 'RemoveTimestampsFromCatalogEntities1769815055471'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cinematic_roles" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "cinematic_roles" DROP COLUMN IF EXISTS "updatedAt"`,
    )
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN IF EXISTS "createdAt"`)
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN IF EXISTS "updatedAt"`)
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" DROP COLUMN IF EXISTS "createdAt"`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "createdAt"`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN IF EXISTS "updatedAt"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "cinematic_roles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "cinematic_roles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }
}
