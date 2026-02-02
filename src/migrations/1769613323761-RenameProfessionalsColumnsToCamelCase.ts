import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameProfessionalsColumnsToCamelCase1769613323761
  implements MigrationInterface
{
  name = 'RenameProfessionalsColumnsToCamelCase1769613323761'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "created_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "updated_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "owner_id"`,
    )
    await queryRunner.query(`ALTER TABLE "professionals" ADD "ownerId" integer`)
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "updatedAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "createdAt"`,
    )
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "ownerId"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "owner_id" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
  }
}
