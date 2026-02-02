import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOwnerIdToEntities1739000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add owner_id to professionals table
    const hasProfOwner = await queryRunner.hasColumn(
      'professionals',
      'owner_id',
    )
    if (!hasProfOwner) {
      await queryRunner.query(`
        ALTER TABLE "professionals"
        ADD COLUMN "owner_id" integer;
      `)
    }

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_professionals_owner" ON "professionals"("owner_id")`,
    )

    // Add owner_id to companies table
    const hasCompanyOwner = await queryRunner.hasColumn('companies', 'owner_id')
    if (!hasCompanyOwner) {
      await queryRunner.query(`
        ALTER TABLE "companies"
        ADD COLUMN "owner_id" integer;
      `)
    }

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_companies_owner" ON "companies"("owner_id")`,
    )

    // Add owner_id to movies table
    const hasMovieOwner = await queryRunner.hasColumn('movies', 'owner_id')
    if (!hasMovieOwner) {
      await queryRunner.query(`
        ALTER TABLE "movies"
        ADD COLUMN "owner_id" integer;
      `)
    }

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_movies_owner" ON "movies"("owner_id")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove from movies
    await queryRunner.query(`DROP INDEX "idx_movies_owner"`)
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "owner_id"`)

    // Remove from companies
    await queryRunner.query(`DROP INDEX "idx_companies_owner"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "owner_id"`)

    // Remove from professionals
    await queryRunner.query(`DROP INDEX "idx_professionals_owner"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "owner_id"`,
    )
  }
}
