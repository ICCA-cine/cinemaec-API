import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameDocumentaryGenreAndAddPedagogicalSheet1769629986912
  implements MigrationInterface
{
  name = 'RenameDocumentaryGenreAndAddPedagogicalSheet1769629986912'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" DROP COLUMN "documentaryGenre"`,
    )
    await queryRunner.query(`DROP TYPE "public"."movies_documentarygenre_enum"`)
    await queryRunner.query(
      `CREATE TYPE "public"."movies_genre_enum" AS ENUM('Ficción', 'Documental', 'Docu-ficción', 'Falso Documental')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "genre" "public"."movies_genre_enum" NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "pedagogicalSheetAssetId" integer`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_1a7c6b261d64b248c41174859fc" FOREIGN KEY ("pedagogicalSheetAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies" DROP CONSTRAINT "FK_1a7c6b261d64b248c41174859fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" DROP COLUMN "pedagogicalSheetAssetId"`,
    )
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "genre"`)
    await queryRunner.query(`DROP TYPE "public"."movies_genre_enum"`)
    await queryRunner.query(
      `CREATE TYPE "public"."movies_documentarygenre_enum" AS ENUM('Ficción', 'Documental', 'Docu-ficción', 'Falso Documental')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "documentaryGenre" "public"."movies_documentarygenre_enum" NOT NULL`,
    )
  }
}
