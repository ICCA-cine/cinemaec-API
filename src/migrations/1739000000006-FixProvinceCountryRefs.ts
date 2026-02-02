import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixProvinceCountryRefs1739000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure Ecuador exists
    await queryRunner.query(
      `INSERT INTO countries (code, name) VALUES ('EC', 'Ecuador')
       ON CONFLICT (code) DO NOTHING`,
    )

    // Get Ecuador id
    const ecResult = await queryRunner.query(
      `SELECT id FROM countries WHERE code = 'EC' LIMIT 1`,
    )
    const ecId = ecResult?.[0]?.id

    if (!ecId) {
      throw new Error('Ecuador country not found for fixing provinces')
    }

    // Repoint any province whose countryId is missing to Ecuador
    await queryRunner.query(
      `UPDATE provinces p
       SET "countryId" = $1
       WHERE "countryId" IS NULL
          OR "countryId" NOT IN (SELECT id FROM countries)`,
      [ecId],
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op rollback to avoid data loss; keep provinces pointing to Ecuador
  }
}
