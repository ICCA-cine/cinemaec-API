import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveDuplicateOwnerIdFromMovies1769612960307
  implements MigrationInterface
{
  name = 'RemoveDuplicateOwnerIdFromMovies1769612960307'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasOwnerIdColumn = await queryRunner.hasColumn('movies', 'owner_id')
    if (hasOwnerIdColumn) {
      await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN IF EXISTS "owner_id"`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" ADD "owner_id" integer`)
  }
}
