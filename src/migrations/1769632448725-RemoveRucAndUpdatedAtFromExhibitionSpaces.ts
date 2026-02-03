import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveRucAndUpdatedAtFromExhibitionSpaces1769632448725
  implements MigrationInterface
{
  name = 'RemoveRucAndUpdatedAtFromExhibitionSpaces1769632448725'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" DROP COLUMN IF EXISTS "updatedAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" DROP CONSTRAINT IF EXISTS "UQ_9d2d978a08ab74328be5536f01d"`,
    )
    await queryRunner.query(`ALTER TABLE "exhibition_spaces" DROP COLUMN IF EXISTS "ruc"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" ADD "ruc" character varying(20) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" ADD CONSTRAINT "UQ_9d2d978a08ab74328be5536f01d" UNIQUE ("ruc")`,
    )
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }
}
