import { MigrationInterface, QueryRunner } from 'typeorm'

export class ConvertAssetIdColumnsToManyToOneRelations1769623775047
  implements MigrationInterface
{
  name = 'ConvertAssetIdColumnsToManyToOneRelations1769623775047'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_bf76e4761bd36563bcc482c6857" FOREIGN KEY ("posterAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_e5fd602bd941753e6f8fa89d9ee" FOREIGN KEY ("frameAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_f07560a4ae003146d985742dd87" FOREIGN KEY ("dossierAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT IF EXISTS "FK_f07560a4ae003146d985742dd87"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT IF EXISTS "FK_e5fd602bd941753e6f8fa89d9ee"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT IF EXISTS "FK_bf76e4761bd36563bcc482c6857"`,
    )
  }
}
