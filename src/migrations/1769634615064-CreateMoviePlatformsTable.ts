import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMoviePlatformsTable1769634615064
  implements MigrationInterface
{
  name = 'CreateMoviePlatformsTable1769634615064'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movie_platforms" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "platformId" integer NOT NULL, "link" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4511a19130a1b992fab1216cbe4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" ADD CONSTRAINT "FK_49723d0f9d9ca16be6c6e8e1902" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" ADD CONSTRAINT "FK_ef3b701dfb274050e5465a066d4" FOREIGN KEY ("platformId") REFERENCES "platforms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" DROP CONSTRAINT IF EXISTS "FK_ef3b701dfb274050e5465a066d4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_platforms" DROP CONSTRAINT IF EXISTS "FK_49723d0f9d9ca16be6c6e8e1902"`,
    )
    await queryRunner.query(`DROP TABLE "movie_platforms"`)
  }
}
