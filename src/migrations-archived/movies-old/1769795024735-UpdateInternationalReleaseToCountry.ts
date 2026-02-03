import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateInternationalReleaseToCountry1769795024735
  implements MigrationInterface
{
  name = 'UpdateInternationalReleaseToCountry1769795024735'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP CONSTRAINT IF EXISTS "FK_7cea3bc763abda6f174ef424e47"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" RENAME COLUMN "cityId" TO "countryId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD CONSTRAINT "FK_f0b15546648f837fb5dfcbd6949" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP CONSTRAINT IF EXISTS "FK_f0b15546648f837fb5dfcbd6949"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" RENAME COLUMN "countryId" TO "cityId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD CONSTRAINT "FK_7cea3bc763abda6f174ef424e47" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
