import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIsActiveAndStatusToMoviesProfessionalsCompanies1769815213191
  implements MigrationInterface
{
  name = 'AddIsActiveAndStatusToMoviesProfessionalsCompanies1769815213191'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."professionals_status_enum" AS ENUM('active', 'inactive', 'verified', 'pending_verification', 'suspended')`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "status" "public"."professionals_status_enum" NOT NULL DEFAULT 'active'`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."companies_status_enum" AS ENUM('active', 'inactive', 'verified', 'pending_verification', 'rejected')`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD "status" "public"."companies_status_enum" NOT NULL DEFAULT 'active'`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movies_status_enum" AS ENUM('draft', 'in_review', 'approved', 'rejected', 'archived')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "status" "public"."movies_status_enum" NOT NULL DEFAULT 'draft'`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."movies_projectstatus_enum" RENAME TO "movies_projectstatus_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movies_projectstatus_enum" AS ENUM('desarrollo', 'produccion', 'postproduccion', 'distribucion', 'finalizado')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "projectStatus" TYPE "public"."movies_projectstatus_enum" USING "projectStatus"::"text"::"public"."movies_projectstatus_enum"`,
    )
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."movies_projectstatus_enum_old"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."movies_projectstatus_enum_old" AS ENUM('desarrollo', 'produccion', 'post_produccion', 'distribucion', 'finalizado')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "projectStatus" TYPE "public"."movies_projectstatus_enum_old" USING "projectStatus"::"text"::"public"."movies_projectstatus_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_projectstatus_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."movies_projectstatus_enum_old" RENAME TO "movies_projectstatus_enum"`,
    )
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_status_enum"`)
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "isActive"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."companies_status_enum"`)
    await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "isActive"`)
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."professionals_status_enum"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "isActive"`,
    )
  }
}
