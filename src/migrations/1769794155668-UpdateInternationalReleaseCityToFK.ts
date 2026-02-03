import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateInternationalReleaseCityToFK1769794155668
  implements MigrationInterface
{
  name = 'UpdateInternationalReleaseCityToFK1769794155668'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" RENAME COLUMN "city" TO "cityId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP COLUMN IF EXISTS "cityId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD "cityId" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD CONSTRAINT "FK_7cea3bc763abda6f174ef424e47" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP CONSTRAINT IF EXISTS "FK_7cea3bc763abda6f174ef424e47"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP COLUMN IF EXISTS "cityId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD "cityId" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" RENAME COLUMN "cityId" TO "city"`,
    )
  }
}
