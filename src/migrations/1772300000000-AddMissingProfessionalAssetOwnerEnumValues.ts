import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMissingProfessionalAssetOwnerEnumValues1772300000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'professional_profile_photo'
    `)

    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'professional_portfolio_image'
    `)

    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'movie_dossier'
    `)

    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'movie_dossier_en'
    `)

    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'movie_pedagogical_guide'
    `)
  }

  public async down(): Promise<void> {
    console.log(
      'Cannot safely remove enum values from PostgreSQL. Manual rollback required if needed.',
    )
  }
}
