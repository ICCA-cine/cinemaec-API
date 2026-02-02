import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameSpanishColumnsToEnglish1769612619639
  implements MigrationInterface
{
  name = 'RenameSpanishColumnsToEnglish1769612619639'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" RENAME COLUMN "nombre" TO "name"`,
    )
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "sexo"`)
    await queryRunner.query(`DROP TYPE "public"."professionals_sexo_enum"`)
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "nombres"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "apellidos"`,
    )
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "cedula"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "telefono"`,
    )
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."platforms_tipo_enum"`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "nombre"`)
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "tipo"`)
    await queryRunner.query(`DROP TYPE "public"."funds_tipo_enum"`)
    await queryRunner.query(
      `ALTER TABLE "funds" DROP COLUMN "origenFinanciero"`,
    )
    await queryRunner.query(`DROP TYPE "public"."funds_origenfinanciero_enum"`)
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "nombre"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "firstName" character varying(100) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "lastName" character varying(100) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "idNumber" character varying(20)`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."professionals_gender_enum" AS ENUM('masculino', 'femenino')`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "gender" "public"."professionals_gender_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "phone" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "name" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "type" "public"."platforms_type_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "name" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_type_enum" AS ENUM('fondo', 'festival', 'premio', 'espacios_participacion')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "type" "public"."funds_type_enum"[] NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_financialorigin_enum" AS ENUM('publico', 'privado', 'mixto', 'desconocido')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "financialOrigin" "public"."funds_financialorigin_enum" NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "financialOrigin"`)
    await queryRunner.query(`DROP TYPE "public"."funds_financialorigin_enum"`)
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."funds_type_enum"`)
    await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "name"`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "type"`)
    await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "name"`)
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "phone"`)
    await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "gender"`)
    await queryRunner.query(`DROP TYPE "public"."professionals_gender_enum"`)
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "idNumber"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "lastName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "firstName"`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "nombre" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_origenfinanciero_enum" AS ENUM('desconocido', 'mixto', 'privado', 'publico')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "origenFinanciero" "public"."funds_origenfinanciero_enum" NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."funds_tipo_enum" AS ENUM('espacios_participacion', 'festival', 'fondo', 'premio')`,
    )
    await queryRunner.query(
      `ALTER TABLE "funds" ADD "tipo" "public"."funds_tipo_enum"[] NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "nombre" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."platforms_tipo_enum" AS ENUM('internacional', 'nacional')`,
    )
    await queryRunner.query(
      `ALTER TABLE "platforms" ADD "tipo" "public"."platforms_tipo_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "telefono" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "cedula" character varying(20)`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "apellidos" character varying(100) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "nombres" character varying(100) NOT NULL`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."professionals_sexo_enum" AS ENUM('femenino', 'masculino')`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "sexo" "public"."professionals_sexo_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" RENAME COLUMN "name" TO "nombre"`,
    )
  }
}
