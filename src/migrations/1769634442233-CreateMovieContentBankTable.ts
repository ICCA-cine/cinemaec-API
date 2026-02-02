import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieContentBankTable1769634442233
  implements MigrationInterface
{
  name = 'CreateMovieContentBankTable1769634442233'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_content_bank" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "licensingStartDate" date NOT NULL, "licensingEndDate" date NOT NULL, "exhibitionWindow" character varying array NOT NULL, "geolocationRestrictionCountryId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e35f9b955ef8b3140c31a8363c4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD CONSTRAINT "FK_a464ed02fbe56d962cabd685b9c" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" ADD CONSTRAINT "FK_576ad62103ed6dafc17b0029c1c" FOREIGN KEY ("geolocationRestrictionCountryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP CONSTRAINT "FK_576ad62103ed6dafc17b0029c1c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_content_bank" DROP CONSTRAINT "FK_a464ed02fbe56d962cabd685b9c"`,
    )
    await queryRunner.query(`DROP TABLE "movie_content_bank"`)
  }
}
