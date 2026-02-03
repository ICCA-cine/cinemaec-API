import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeReleaseYearNullableInMovies1769623673366
  implements MigrationInterface
{
  name = 'MakeReleaseYearNullableInMovies1769623673366'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "releaseYear" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "releaseYear" SET NOT NULL`,
    )
  }
}
