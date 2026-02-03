import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDossierEnToMovies1769629823687 implements MigrationInterface {
  name = 'AddDossierEnToMovies1769629823687'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "dossierAssetEnId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_e6cc4846015042340121e338325" FOREIGN KEY ("dossierAssetEnId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT IF EXISTS "FK_e6cc4846015042340121e338325"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" DROP COLUMN "dossierAssetEnId"`,
    )
  }
}
