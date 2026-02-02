import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameSpanishColumnsToEnglish1769612619639
  implements MigrationInterface
{
  name = 'RenameSpanishColumnsToEnglish1769612619639'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exhibition_spaces" RENAME COLUMN "nombre" TO "name"`,
    )
    
    // Verificar si existe la columna sexo antes de eliminarla
    const hasSexoColumn = await queryRunner.hasColumn('professionals', 'sexo')
    if (hasSexoColumn) {
      await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "sexo"`)
    }
    
    // Verificar si existe el tipo antes de eliminarlo
    const sexoEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'professionals_sexo_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (sexoEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE "public"."professionals_sexo_enum"`)
    }
    
    const hasNombresColumn = await queryRunner.hasColumn('professionals', 'nombres')
    if (hasNombresColumn) {
      await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "nombres"`)
    }
    
    const hasApellidosColumn = await queryRunner.hasColumn('professionals', 'apellidos')
    if (hasApellidosColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" DROP COLUMN "apellidos"`,
      )
    }
    
    const hasCedulaColumn = await queryRunner.hasColumn('professionals', 'cedula')
    if (hasCedulaColumn) {
      await queryRunner.query(`ALTER TABLE "professionals" DROP COLUMN "cedula"`)
    }
    
    const hasTelefonoColumn = await queryRunner.hasColumn('professionals', 'telefono')
    if (hasTelefonoColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" DROP COLUMN "telefono"`,
      )
    }
    
    // Platforms
    const hasPlatformTipoColumn = await queryRunner.hasColumn('platforms', 'tipo')
    if (hasPlatformTipoColumn) {
      await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "tipo"`)
    }
    
    const platformsTipoEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'platforms_tipo_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (platformsTipoEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE "public"."platforms_tipo_enum"`)
    }
    
    const hasPlatformNombreColumn = await queryRunner.hasColumn('platforms', 'nombre')
    if (hasPlatformNombreColumn) {
      await queryRunner.query(`ALTER TABLE "platforms" DROP COLUMN "nombre"`)
    }
    
    // Funds
    const hasFundTipoColumn = await queryRunner.hasColumn('funds', 'tipo')
    if (hasFundTipoColumn) {
      await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "tipo"`)
    }
    
    const fundsTipoEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'funds_tipo_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (fundsTipoEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE "public"."funds_tipo_enum"`)
    }
    
    const hasFundOrigenColumn = await queryRunner.hasColumn('funds', 'origenFinanciero')
    if (hasFundOrigenColumn) {
      await queryRunner.query(
        `ALTER TABLE "funds" DROP COLUMN "origenFinanciero"`,
      )
    }
    
    const fundsOrigenEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'funds_origenfinanciero_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (fundsOrigenEnumExists[0].exists) {
      await queryRunner.query(`DROP TYPE "public"."funds_origenfinanciero_enum"`)
    }
    
    const hasFundNombreColumn = await queryRunner.hasColumn('funds', 'nombre')
    if (hasFundNombreColumn) {
      await queryRunner.query(`ALTER TABLE "funds" DROP COLUMN "nombre"`)
    }
    
    // Agregar nuevas columnas solo si no existen
    const hasFirstNameColumn = await queryRunner.hasColumn('professionals', 'firstName')
    if (!hasFirstNameColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD "firstName" character varying(100) NOT NULL`,
      )
    }
    
    const hasLastNameColumn = await queryRunner.hasColumn('professionals', 'lastName')
    if (!hasLastNameColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD "lastName" character varying(100) NOT NULL`,
      )
    }
    
    const hasIdNumberColumn = await queryRunner.hasColumn('professionals', 'idNumber')
    if (!hasIdNumberColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD "idNumber" character varying(20)`,
      )
    }
    
    // Crear enum para gender si no existe
    const genderEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'professionals_gender_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    if (!genderEnumExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "public"."professionals_gender_enum" AS ENUM('masculino', 'femenino')`,
      )
    }
    
    const hasGenderColumn = await queryRunner.hasColumn('professionals', 'gender')
    if (!hasGenderColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD "gender" "public"."professionals_gender_enum" NOT NULL`,
      )
    }
    
    const hasPhoneColumn = await queryRunner.hasColumn('professionals', 'phone')
    if (!hasPhoneColumn) {
      await queryRunner.query(
        `ALTER TABLE "professionals" ADD "phone" character varying(20)`,
      )
    }
    
    const hasPlatformNameColumn = await queryRunner.hasColumn('platforms', 'name')
    if (!hasPlatformNameColumn) {
      await queryRunner.query(
        `ALTER TABLE "platforms" ADD "name" character varying(255) NOT NULL`,
      )
    }
    
    // Verificar qué enum existe para platforms type
    const platformsTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'platforms_type_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    
    const platformTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'platform_type_enum'
      )
    `)
    
    const hasPlatformTypeColumn = await queryRunner.hasColumn('platforms', 'type')
    if (!hasPlatformTypeColumn) {
      // Usar el enum que exista (platforms_type_enum tiene prioridad, luego platform_type_enum)
      if (platformsTypeEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "platforms" ADD "type" "public"."platforms_type_enum" NOT NULL`,
        )
      } else if (platformTypeEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "platforms" ADD "type" platform_type_enum NOT NULL`,
        )
      }
    }
    
    const hasFundNameColumn = await queryRunner.hasColumn('funds', 'name')
    if (!hasFundNameColumn) {
      await queryRunner.query(
        `ALTER TABLE "funds" ADD "name" character varying(255) NOT NULL`,
      )
    }
    
    // Verificar ambas versiones del enum (funds_type_enum y fund_type_enum)
    const fundsTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'funds_type_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    
    const fundTypeEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'fund_type_enum'
      )
    `)
    
    if (!fundsTypeEnumExists[0].exists && !fundTypeEnumExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "public"."funds_type_enum" AS ENUM('fondo', 'festival', 'premio', 'espacios_participacion')`,
      )
    }
    
    const hasFundTypeColumn = await queryRunner.hasColumn('funds', 'type')
    if (!hasFundTypeColumn) {
      // Usar el enum que exista
      if (fundsTypeEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "funds" ADD "type" "public"."funds_type_enum"[] NOT NULL`,
        )
      } else if (fundTypeEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "funds" ADD "type" fund_type_enum[] NOT NULL`,
        )
      }
    }
    
    // Verificar ambas versiones del enum (funds_financialorigin_enum y financial_origin_enum)
    const fundsFinancialOriginEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'funds_financialorigin_enum'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      )
    `)
    
    const financialOriginEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'financial_origin_enum'
      )
    `)
    
    if (!fundsFinancialOriginEnumExists[0].exists && !financialOriginEnumExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "public"."funds_financialorigin_enum" AS ENUM('publico', 'privado', 'mixto', 'desconocido')`,
      )
    }
    
    const hasFundFinancialOriginColumn = await queryRunner.hasColumn('funds', 'financialOrigin')
    if (!hasFundFinancialOriginColumn) {
      // Usar el enum que exista
      if (fundsFinancialOriginEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "funds" ADD "financialOrigin" "public"."funds_financialorigin_enum" NOT NULL`,
        )
      } else if (financialOriginEnumExists[0].exists) {
        await queryRunner.query(
          `ALTER TABLE "funds" ADD "financialOrigin" financial_origin_enum NOT NULL`,
        )
      }
    }
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
