import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSpaceNameToInternationalRelease1769795251602
  implements MigrationInterface
{
  name = 'AddSpaceNameToInternationalRelease1769795251602'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" ADD "spaceName" character varying(255)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_international_releases" DROP COLUMN "spaceName"`,
    )
  }
}
