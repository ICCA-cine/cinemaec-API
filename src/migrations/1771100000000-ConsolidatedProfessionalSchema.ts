import { MigrationInterface, QueryRunner } from 'typeorm'

export class ConsolidatedProfessionalSchema1771100000000
  implements MigrationInterface
{
  name = 'ConsolidatedProfessionalSchema1771100000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add professional profile fields
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "nickName" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "rrss" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "bio" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "bioEn" text`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "profilePhotoAssetId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "reelLink" character varying(500)`,
    )

    // Add professional activity roles
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "primaryActivityRoleId1" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "primaryActivityRoleId2" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "secondaryActivityRoleId1" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "secondaryActivityRoleId2" integer`,
    )

    // Add company name and CEO field
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD COLUMN IF NOT EXISTS "companyNameCEO" character varying(255)`,
    )

    // Create professional portfolio images table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "professional_portfolio_images" (
        "id" SERIAL PRIMARY KEY,
        "professionalId" integer NOT NULL,
        "assetId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      ALTER TABLE "professional_portfolio_images"
      ADD CONSTRAINT "FK_professional_portfolio_images_professional"
      FOREIGN KEY ("professionalId") REFERENCES "professionals"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `)

    await queryRunner.query(`
      ALTER TABLE "professional_portfolio_images"
      ADD CONSTRAINT "FK_professional_portfolio_images_asset"
      FOREIGN KEY ("assetId") REFERENCES "assets"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `)

    // Add accredited column to movie professionals
    try {
      const hasAccredited = await queryRunner.query(`
        SELECT COUNT(*)
        FROM information_schema.columns
        WHERE table_name = 'movie_professionals'
        AND column_name = 'accredited'
      `)

      if (hasAccredited[0]?.count === '0') {
        await queryRunner.query(`
          ALTER TABLE "movie_professionals"
          ADD COLUMN "accredited" boolean DEFAULT false NOT NULL
        `)
      }
    } catch (error) {
      console.warn('Could not add accredited column:', error.message)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove accredited column from movie professionals
    try {
      await queryRunner.query(`
        ALTER TABLE "movie_professionals"
        DROP COLUMN IF EXISTS "accredited"
      `)
    } catch (error) {
      console.warn('Could not remove accredited column:', error.message)
    }

    // Drop professional portfolio images table
    await queryRunner.query(
      `ALTER TABLE "professional_portfolio_images" DROP CONSTRAINT IF EXISTS "FK_professional_portfolio_images_asset"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professional_portfolio_images" DROP CONSTRAINT IF EXISTS "FK_professional_portfolio_images_professional"`,
    )
    await queryRunner.query(
      `DROP TABLE IF EXISTS "professional_portfolio_images"`,
    )

    // Remove professional profile columns
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "reelLink"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "profilePhotoAssetId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "bioEn"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "bio"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "rrss"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "nickName"`,
    )

    // Remove activity role columns
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "secondaryActivityRoleId2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "secondaryActivityRoleId1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "primaryActivityRoleId2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "primaryActivityRoleId1"`,
    )

    // Remove company name and CEO field
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN IF EXISTS "companyNameCEO"`,
    )
  }
}
