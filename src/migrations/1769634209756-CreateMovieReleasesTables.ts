import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieReleasesTables1769634209756
  implements MigrationInterface
{
  name = 'CreateMovieReleasesTables1769634209756'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_national_releases" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "exhibitionSpaceId" integer NOT NULL, "cityId" integer NOT NULL, "year" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0cca600383a3a1994a6d776af" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "movie_international_releases" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "city" character varying(255) NOT NULL, "year" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ccee6d164cfb0bf4a81e892c100" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" ADD CONSTRAINT "FK_200a6f4dceb1310680f7d16578c" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" ADD CONSTRAINT "FK_c1ec993b95ec07cec9e5e8545c5" FOREIGN KEY ("exhibitionSpaceId") REFERENCES "exhibition_spaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" ADD CONSTRAINT "FK_ce2db3f284f4aa1cb9d0b189631" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD CONSTRAINT "FK_24a4e2fe4daa9b79d2f6a32765c" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP CONSTRAINT "FK_24a4e2fe4daa9b79d2f6a32765c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" DROP CONSTRAINT "FK_ce2db3f284f4aa1cb9d0b189631"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" DROP CONSTRAINT "FK_c1ec993b95ec07cec9e5e8545c5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_national_releases" DROP CONSTRAINT "FK_200a6f4dceb1310680f7d16578c"`,
    )
    await queryRunner.query(`DROP TABLE "movie_international_releases"`)
    await queryRunner.query(`DROP TABLE "movie_national_releases"`)
  }
}
