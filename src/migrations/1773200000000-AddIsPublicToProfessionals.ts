import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsPublicToProfessionals1773200000000 implements MigrationInterface {
  name = 'AddIsPublicToProfessionals1773200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasProfessionalsTable = await queryRunner.hasTable('professionals')

    if (!hasProfessionalsTable) {
      return
    }

    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "isPublic" boolean NOT NULL DEFAULT false`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasProfessionalsTable = await queryRunner.hasTable('professionals')

    if (!hasProfessionalsTable) {
      return
    }

    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "isPublic"`,
    )
  }
}
