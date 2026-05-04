import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddExtendedBiofilmographyFields1682700000000 implements MigrationInterface {
  name = 'AddExtendedBiofilmographyFields1682700000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "extendedBiofilmography" text NOT NULL DEFAULT ''`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "extendedBiofilmography"`,
    )
  }
}
