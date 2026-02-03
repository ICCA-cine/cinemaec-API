import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveOwnerIdFromExhibitionSpacesAndFunds1769612878620
  implements MigrationInterface
{
  name = 'RemoveOwnerIdFromExhibitionSpacesAndFunds1769612878620'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN IF EXISTS "ownerId"`)
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" DROP COLUMN IF EXISTS "ownerId"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" ADD "ownerId" integer`,
    )
    await queryRunner.query(`ALTER TABLE "funds" ADD "ownerId" integer`)
  }
}
