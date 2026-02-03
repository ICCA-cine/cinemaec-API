import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveCharacterNameFromMovieProfessional1769795943903
  implements MigrationInterface
{
  name = 'RemoveCharacterNameFromMovieProfessional1769795943903'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN IF EXISTS "characterName"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "characterName" character varying(100)`,
    )
  }
}
