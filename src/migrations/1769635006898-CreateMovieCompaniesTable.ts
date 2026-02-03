import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieCompaniesTable1769635006898
  implements MigrationInterface
{
  name = 'CreateMovieCompaniesTable1769635006898'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."movie_companies_participation_enum" AS ENUM('Productor', 'Coproductor')`,
    )
    await queryRunner.query(
      `CREATE TABLE "movie_companies" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "companyId" integer NOT NULL, "participation" "public"."movie_companies_participation_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1f4a63fc99abe7fdb367215ee9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies" ADD CONSTRAINT "FK_0efb85c101817b5edd8830233cd" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies" ADD CONSTRAINT "FK_6bb332dcf5b8582ff9401b384fa" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_companies" DROP CONSTRAINT IF EXISTS "FK_6bb332dcf5b8582ff9401b384fa"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_companies" DROP CONSTRAINT IF EXISTS "FK_0efb85c101817b5edd8830233cd"`,
    )
    await queryRunner.query(`DROP TABLE "movie_companies"`)
    await queryRunner.query(
      `DROP TYPE "public"."movie_companies_participation_enum"`,
    )
  }
}
