import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieClaimRequestsTable1771200000000
  implements MigrationInterface
{
  name = 'CreateMovieClaimRequestsTable1771200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type
          WHERE typname = 'movie_claim_request_status_enum'
        ) THEN
          CREATE TYPE "movie_claim_request_status_enum" AS ENUM(
            'pending',
            'approved',
            'rejected'
          );
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "movie_claim_requests" (
        "id" SERIAL PRIMARY KEY,
        "movieId" integer NOT NULL,
        "claimantUserId" integer NOT NULL,
        "supportDocumentAssetId" integer NOT NULL,
        "status" "movie_claim_request_status_enum" NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_movie_claim_requests_movie'
        ) THEN
          ALTER TABLE "movie_claim_requests"
          ADD CONSTRAINT "FK_movie_claim_requests_movie"
          FOREIGN KEY ("movieId") REFERENCES "movies"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_movie_claim_requests_user'
        ) THEN
          ALTER TABLE "movie_claim_requests"
          ADD CONSTRAINT "FK_movie_claim_requests_user"
          FOREIGN KEY ("claimantUserId") REFERENCES "users"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_movie_claim_requests_asset'
        ) THEN
          ALTER TABLE "movie_claim_requests"
          ADD CONSTRAINT "FK_movie_claim_requests_asset"
          FOREIGN KEY ("supportDocumentAssetId") REFERENCES "assets"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION;
        END IF;
      END $$;
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_movie_claim_requests_movieId"
      ON "movie_claim_requests" ("movieId")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_movie_claim_requests_claimantUserId"
      ON "movie_claim_requests" ("claimantUserId")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_movie_claim_requests_status"
      ON "movie_claim_requests" ("status")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_movie_claim_requests_status"`,
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_movie_claim_requests_claimantUserId"`,
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_movie_claim_requests_movieId"`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_claim_requests" DROP CONSTRAINT IF EXISTS "FK_movie_claim_requests_asset"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_claim_requests" DROP CONSTRAINT IF EXISTS "FK_movie_claim_requests_user"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_claim_requests" DROP CONSTRAINT IF EXISTS "FK_movie_claim_requests_movie"`,
    )

    await queryRunner.query(`DROP TABLE IF EXISTS "movie_claim_requests"`)
    await queryRunner.query(
      `DROP TYPE IF EXISTS "movie_claim_request_status_enum"`,
    )
  }
}
