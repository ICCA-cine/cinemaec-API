import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateContentBankCountryToArray1769794796470
  implements MigrationInterface
{
  name = 'UpdateContentBankCountryToArray1769794796470'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP CONSTRAINT "FK_576ad62103ed6dafc17b0029c1c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" RENAME COLUMN "geolocationRestrictionCountryId" TO "geolocationRestrictionCountryIds"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP COLUMN "geolocationRestrictionCountryIds"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD "geolocationRestrictionCountryIds" integer array`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP COLUMN "geolocationRestrictionCountryIds"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD "geolocationRestrictionCountryIds" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" RENAME COLUMN "geolocationRestrictionCountryIds" TO "geolocationRestrictionCountryId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD CONSTRAINT "FK_576ad62103ed6dafc17b0029c1c" FOREIGN KEY ("geolocationRestrictionCountryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
