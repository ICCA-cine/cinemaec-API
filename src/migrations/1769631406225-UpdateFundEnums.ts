import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateFundEnums1769631406225 implements MigrationInterface {
  name = 'UpdateFundEnums1769631406225'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."funds_type_enum" RENAME TO "funds_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_type_enum" AS ENUM('Fondo', 'Festival', 'Premio', 'Espacios de participación')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ALTER COLUMN "type" TYPE "public"."funds_type_enum"[] USING "type"::"text"::"public"."funds_type_enum"[]`,
    )
    await queryRunner.query(`DROP TYPE "public"."funds_type_enum_old"`)
    await queryRunner.query(
      `ALTER TYPE "public"."funds_financialorigin_enum" RENAME TO "funds_financialorigin_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_financialorigin_enum" AS ENUM('Público', 'Privado', 'Mixto', 'Desconocido')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ALTER COLUMN "financialOrigin" TYPE "public"."funds_financialorigin_enum" USING "financialOrigin"::"text"::"public"."funds_financialorigin_enum"`,
    )
    await queryRunner.query(
      `DROP TYPE "public"."funds_financialorigin_enum_old"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."funds_financialorigin_enum_old" AS ENUM('desconocido', 'mixto', 'privado', 'publico')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ALTER COLUMN "financialOrigin" TYPE "public"."funds_financialorigin_enum_old" USING "financialOrigin"::"text"::"public"."funds_financialorigin_enum_old"`,
    )
    await queryRunner.query(`DROP TYPE "public"."funds_financialorigin_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."funds_financialorigin_enum_old" RENAME TO "funds_financialorigin_enum"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_type_enum_old" AS ENUM('espacios_participacion', 'festival', 'fondo', 'premio')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ALTER COLUMN "type" TYPE "public"."funds_type_enum_old"[] USING "type"::"text"::"public"."funds_type_enum_old"[]`,
    )
    await queryRunner.query(`DROP TYPE "public"."funds_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."funds_type_enum_old" RENAME TO "funds_type_enum"`,
    )
  }
}
