import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddImdbProfileToProfessionals1682700000001 implements MigrationInterface {
  name = 'AddImdbProfileToProfessionals1682700000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "imdbProfile" varchar NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "imdbProfile"`,
    )
  }
}
