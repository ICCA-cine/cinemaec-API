import { MigrationInterface, QueryRunner } from 'typeorm'

export class ExpandProfessionalMobileLength1785000000000
  implements MigrationInterface
{
  name = 'ExpandProfessionalMobileLength1785000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasProfessionalsTable = await queryRunner.hasTable('professionals')

    if (!hasProfessionalsTable) {
      return
    }

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "mobile" TYPE character varying(30)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasProfessionalsTable = await queryRunner.hasTable('professionals')

    if (!hasProfessionalsTable) {
      return
    }

    await queryRunner.query(
      `ALTER TABLE "professionals" ALTER COLUMN "mobile" TYPE character varying(10)`,
    )
  }
}
