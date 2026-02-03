import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateMovieTypesAndAddDocumentaryGenre1769622800000
  implements MigrationInterface
{
  name = 'UpdateMovieTypesAndAddDocumentaryGenre1769622800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear nuevo enum para documentaryGenre
    await queryRunner.query(
      `CREATE TYPE "public"."movies_documentarygenre_enum" AS ENUM('Ficción', 'Documental', 'Docu-ficción', 'Falso Documental')`,
    )

    // 2. Agregar columna documentaryGenre (nullable temporalmente)
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "documentaryGenre" "public"."movies_documentarygenre_enum"`,
    )

    // 3. Actualizar valores existentes del enum type (cortometraje → Cortometraje, etc.)
    await queryRunner.query(
      `ALTER TYPE "public"."movies_type_enum" RENAME TO "movies_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movies_type_enum" AS ENUM('Cortometraje', 'Mediometraje', 'Largometraje')`,
    )

    // 4. Migrar datos existentes con mapeo
    await queryRunner.query(`
      ALTER TABLE "movies" 
      ALTER COLUMN "type" TYPE "public"."movies_type_enum" 
      USING (
        CASE "type"::text
          WHEN 'cortometraje' THEN 'Cortometraje'
          WHEN 'mediometraje' THEN 'Mediometraje'
          WHEN 'largometraje' THEN 'Largometraje'
        END
      )::"public"."movies_type_enum"
    `)

    // 5. Eliminar el enum antiguo
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_type_enum_old"`)

    // 6. Si hay datos existentes, asignar un valor por defecto a documentaryGenre
    await queryRunner.query(
      `UPDATE "movies" SET "documentaryGenre" = 'Ficción' WHERE "documentaryGenre" IS NULL`,
    )

    // 7. Hacer la columna NOT NULL
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "documentaryGenre" SET NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: hacer nullable la columna
    await queryRunner.query(
      `ALTER TABLE "movies" ALTER COLUMN "documentaryGenre" DROP NOT NULL`,
    )

    // Eliminar columna documentaryGenre
    await queryRunner.query(
      `ALTER TABLE "movies" DROP COLUMN IF EXISTS "documentaryGenre"`,
    )

    // Eliminar enum documentaryGenre
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_documentarygenre_enum"`)

    // Revertir enum type a minúsculas
    await queryRunner.query(
      `ALTER TYPE "public"."movies_type_enum" RENAME TO "movies_type_enum_old"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movies_type_enum" AS ENUM('cortometraje', 'mediometraje', 'largometraje')`,
    )
    await queryRunner.query(`
      ALTER TABLE "movies" 
      ALTER COLUMN "type" TYPE "public"."movies_type_enum" 
      USING (
        CASE "type"::text
          WHEN 'Cortometraje' THEN 'cortometraje'
          WHEN 'Mediometraje' THEN 'mediometraje'
          WHEN 'Largometraje' THEN 'largometraje'
        END
      )::"public"."movies_type_enum"
    `)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movies_type_enum_old"`)
  }
}
