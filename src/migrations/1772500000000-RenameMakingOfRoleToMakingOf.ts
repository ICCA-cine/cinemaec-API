import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameMakingOfRoleToMakingOf1772500000000
  implements MigrationInterface
{
  name = 'RenameMakingOfRoleToMakingOf1772500000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "cinematic_roles"
      SET
        "name" = 'Realización de MakingOf',
        "nameEn" = 'Behind the Scenes / MakingOf'
      WHERE "name" = 'Realización de Making Of'
         OR "nameEn" = 'Behind the Scenes / Making Of'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "cinematic_roles"
      SET
        "name" = 'Realización de Making Of',
        "nameEn" = 'Behind the Scenes / Making Of'
      WHERE "name" = 'Realización de MakingOf'
         OR "nameEn" = 'Behind the Scenes / MakingOf'
    `)
  }
}
