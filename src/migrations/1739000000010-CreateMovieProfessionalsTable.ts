import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieProfessionalsTable1739000000010
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('movie_professionals')
    if (hasTable) {
      return
    }

    await queryRunner.query(`
      CREATE TYPE IF NOT EXISTS "professional_role_enum" AS ENUM(
        'director',
        'productor',
        'guionista',
        'director_fotografia',
        'editor',
        'compositor',
        'sonido',
        'director_arte',
        'actor',
        'otro'
      );
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "movie_professionals" (
        "id" SERIAL PRIMARY KEY,
        "movie_id" integer NOT NULL,
        "professional_id" integer NOT NULL,
        "role" "professional_role_enum" NOT NULL,
        "character_name" varchar(100),
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "fk_movie_professionals_movie" 
          FOREIGN KEY ("movie_id") 
          REFERENCES "movies"("id") 
          ON DELETE CASCADE 
          ON UPDATE CASCADE,
        CONSTRAINT "fk_movie_professionals_professional" 
          FOREIGN KEY ("professional_id") 
          REFERENCES "professionals"("id") 
          ON DELETE CASCADE 
          ON UPDATE CASCADE
      );
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_movie_professionals_movie" ON "movie_professionals"("movie_id")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_movie_professionals_professional" ON "movie_professionals"("professional_id")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_movie_professionals_role" ON "movie_professionals"("role")`,
    )

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "idx_movie_professionals_unique" 
      ON "movie_professionals"("movie_id", "professional_id", "role", "character_name")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_movie_professionals_unique"`)
    await queryRunner.query(`DROP INDEX "idx_movie_professionals_role"`)
    await queryRunner.query(`DROP INDEX "idx_movie_professionals_professional"`)
    await queryRunner.query(`DROP INDEX "idx_movie_professionals_movie"`)
    await queryRunner.query(`DROP TABLE "movie_professionals"`)
    await queryRunner.query(`DROP TYPE "professional_role_enum"`)
  }
}
