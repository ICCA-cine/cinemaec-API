import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieFestivalNominationTable1769633684744
  implements MigrationInterface
{
  name = 'CreateMovieFestivalNominationTable1769633684744'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_festival_nominations" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "fundId" integer NOT NULL, "year" integer NOT NULL, "category" character varying(255) NOT NULL, "result" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c78dfc62b686204d6a35f35c671" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_festival_nominations" ADD CONSTRAINT "FK_6cb5293deafe159f2eac8573113" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_festival_nominations" ADD CONSTRAINT "FK_fdbb7bde9978a747c2638426ebb" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_festival_nominations" DROP CONSTRAINT IF EXISTS "FK_fdbb7bde9978a747c2638426ebb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_festival_nominations" DROP CONSTRAINT IF EXISTS "FK_6cb5293deafe159f2eac8573113"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "movie_festival_nominations"`)
  }
}
