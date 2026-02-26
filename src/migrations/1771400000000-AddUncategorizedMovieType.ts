import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUncategorizedMovieType1771400000000
  implements MigrationInterface
{
  name = 'AddUncategorizedMovieType1771400000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "movies_type_enum"
      ADD VALUE IF NOT EXISTS 'Sin catalogar'
    `)
  }

  public async down(): Promise<void> {}
}
