import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUniqueOwnerIdToProfessionals1770100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_professionals_owner_unique"
      ON "professionals" ("ownerId")
      WHERE "ownerId" IS NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_professionals_owner_unique"',
    )
  }
}
