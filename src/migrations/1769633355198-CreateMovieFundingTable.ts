import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieFundingTable1769633355198
  implements MigrationInterface
{
  name = 'CreateMovieFundingTable1769633355198'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_funding" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "fundId" integer NOT NULL, "year" integer NOT NULL, "amountGranted" numeric(12,2), "fundingStage" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_833a5aeb070b442883844489e4c" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_funding" ADD CONSTRAINT "FK_154eb4db666b132a8fa3b2284ff" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_funding" ADD CONSTRAINT "FK_b5303cd7c13b49915f7e29ac375" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_funding" DROP CONSTRAINT "FK_b5303cd7c13b49915f7e29ac375"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_funding" DROP CONSTRAINT "FK_154eb4db666b132a8fa3b2284ff"`,
    )
    await queryRunner.query(`DROP TABLE "movie_funding"`)
  }
}
