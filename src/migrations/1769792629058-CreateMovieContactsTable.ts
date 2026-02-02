import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieContactsTable1769792629058
  implements MigrationInterface
{
  name = 'CreateMovieContactsTable1769792629058'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."movie_contacts_cargo_enum" AS ENUM('Productora', 'Director', 'Agente de ventas', 'Distribuidor')`,
    )
    await queryRunner.query(
      `CREATE TABLE "movie_contacts" ("id" SERIAL NOT NULL, "movieId" integer NOT NULL, "professionalId" integer NOT NULL, "cargo" "public"."movie_contacts_cargo_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d1b64c74a5920640be452a3a427" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD CONSTRAINT "FK_f5a9136ee4faeccd67518e0514c" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" ADD CONSTRAINT "FK_3c3cc6ab29aee76e86dddc4aa7f" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP CONSTRAINT "FK_3c3cc6ab29aee76e86dddc4aa7f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_contacts" DROP CONSTRAINT "FK_f5a9136ee4faeccd67518e0514c"`,
    )
    await queryRunner.query(`DROP TABLE "movie_contacts"`)
    await queryRunner.query(`DROP TYPE "public"."movie_contacts_cargo_enum"`)
  }
}
