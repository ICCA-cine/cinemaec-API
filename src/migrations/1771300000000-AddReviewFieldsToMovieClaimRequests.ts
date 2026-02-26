import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReviewFieldsToMovieClaimRequests1771300000000
  implements MigrationInterface
{
  name = 'AddReviewFieldsToMovieClaimRequests1771300000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "movie_claim_requests"
      ADD COLUMN IF NOT EXISTS "observation" text,
      ADD COLUMN IF NOT EXISTS "reviewedByUserId" integer,
      ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP
    `)

    await queryRunner.query(`
      ALTER TABLE "movie_claim_requests"
      ADD CONSTRAINT "FK_movie_claim_requests_reviewed_by_user"
      FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_movie_claim_requests_reviewedByUserId"
      ON "movie_claim_requests" ("reviewedByUserId")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_movie_claim_requests_reviewedByUserId"`,
    )

    await queryRunner.query(
      `ALTER TABLE "movie_claim_requests" DROP CONSTRAINT IF EXISTS "FK_movie_claim_requests_reviewed_by_user"`,
    )

    await queryRunner.query(`
      ALTER TABLE "movie_claim_requests"
      DROP COLUMN IF EXISTS "reviewedAt",
      DROP COLUMN IF EXISTS "reviewedByUserId",
      DROP COLUMN IF EXISTS "observation"
    `)
  }
}
