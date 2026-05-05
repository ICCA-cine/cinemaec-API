import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCatalogRelationsTables1773500000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "catalog_movies" (
        "catalogId" integer NOT NULL,
        "movieId"   integer NOT NULL,
        CONSTRAINT "PK_catalog_movies" PRIMARY KEY ("catalogId", "movieId"),
        CONSTRAINT "FK_catalog_movies_catalog"
          FOREIGN KEY ("catalogId") REFERENCES "admin_catalogs"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_catalog_movies_movie"
          FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_movies_catalogId" ON "catalog_movies" ("catalogId")`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_movies_movieId" ON "catalog_movies" ("movieId")`,
    )

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "catalog_festivals" (
        "catalogId"  integer NOT NULL,
        "festivalId" integer NOT NULL,
        CONSTRAINT "PK_catalog_festivals" PRIMARY KEY ("catalogId", "festivalId"),
        CONSTRAINT "FK_catalog_festivals_catalog"
          FOREIGN KEY ("catalogId") REFERENCES "admin_catalogs"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_catalog_festivals_festival"
          FOREIGN KEY ("festivalId") REFERENCES "festivals"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_festivals_catalogId" ON "catalog_festivals" ("catalogId")`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_festivals_festivalId" ON "catalog_festivals" ("festivalId")`,
    )

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "catalog_professionals" (
        "catalogId"      integer NOT NULL,
        "professionalId" integer NOT NULL,
        CONSTRAINT "PK_catalog_professionals" PRIMARY KEY ("catalogId", "professionalId"),
        CONSTRAINT "FK_catalog_professionals_catalog"
          FOREIGN KEY ("catalogId") REFERENCES "admin_catalogs"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_catalog_professionals_professional"
          FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_professionals_catalogId" ON "catalog_professionals" ("catalogId")`,
    )
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_catalog_professionals_professionalId" ON "catalog_professionals" ("professionalId")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "catalog_professionals"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "catalog_festivals"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "catalog_movies"`)
  }
}
