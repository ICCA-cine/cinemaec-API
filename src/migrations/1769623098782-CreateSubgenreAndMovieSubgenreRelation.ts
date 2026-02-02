import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSubgenreAndMovieSubgenreRelation1769623098782
  implements MigrationInterface
{
  name = 'CreateSubgenreAndMovieSubgenreRelation1769623098782'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies_languages" DROP CONSTRAINT "FK_006d624c816ba35bd454e24242d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" DROP CONSTRAINT "FK_5a9997ed49cb1786c58a8a1c166"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" DROP CONSTRAINT "FK_463bc547129a23f8ca3d3aae2d5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" DROP CONSTRAINT "FK_2b3aa1267e6a7fbde92b0c5d6fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" DROP CONSTRAINT "FK_d89a5330076eff19a3cb6a1a3ae"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" DROP CONSTRAINT "FK_955404a5353c436e397f3131d32"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_006d624c816ba35bd454e24242"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5a9997ed49cb1786c58a8a1c16"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2b3aa1267e6a7fbde92b0c5d6f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_463bc547129a23f8ca3d3aae2d"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_955404a5353c436e397f3131d3"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d89a5330076eff19a3cb6a1a3a"`,
    )
    await queryRunner.query(
      `CREATE TABLE "subgenres" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_02590b4c5075f9a45dcbee95deb" UNIQUE ("name"), CONSTRAINT "PK_5532e81efee4754bdf3eaefcc2a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "movies_subgenres" ("movieId" integer NOT NULL, "subgenreId" integer NOT NULL, CONSTRAINT "PK_23a19ffc74c5c3a526b1d0dabbd" PRIMARY KEY ("movieId", "subgenreId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a6bca6be1b1c64184b9aa419bf" ON "movies_subgenres" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e0c3a62facdefc5914a962556c" ON "movies_subgenres" ("subgenreId") `,
    )
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "genres"`)
    await queryRunner.query(`DROP TYPE "public"."movies_genres_enum"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_9bf4f1d3e78ce525a91b7b7edc" ON "movies_languages" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_eb6e8b786285e7585501324756" ON "movies_languages" ("languageId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c35f1969374cdc0b4ad86be187" ON "movies_provinces" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_13ffc7aeaa64e35064e7015d82" ON "movies_provinces" ("provinceId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_213a2c1dec9b314426a1750e0b" ON "movies_cities" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f2ac93cdeec95afae4b7a4713c" ON "movies_cities" ("cityId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subgenres" ADD CONSTRAINT "FK_a6bca6be1b1c64184b9aa419bf0" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subgenres" ADD CONSTRAINT "FK_e0c3a62facdefc5914a962556c5" FOREIGN KEY ("subgenreId") REFERENCES "subgenres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" ADD CONSTRAINT "FK_9bf4f1d3e78ce525a91b7b7edc5" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" ADD CONSTRAINT "FK_eb6e8b786285e75855013247569" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" ADD CONSTRAINT "FK_c35f1969374cdc0b4ad86be1875" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" ADD CONSTRAINT "FK_13ffc7aeaa64e35064e7015d82c" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" ADD CONSTRAINT "FK_213a2c1dec9b314426a1750e0b1" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" ADD CONSTRAINT "FK_f2ac93cdeec95afae4b7a4713cd" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies_cities" DROP CONSTRAINT "FK_f2ac93cdeec95afae4b7a4713cd"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" DROP CONSTRAINT "FK_213a2c1dec9b314426a1750e0b1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" DROP CONSTRAINT "FK_13ffc7aeaa64e35064e7015d82c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" DROP CONSTRAINT "FK_c35f1969374cdc0b4ad86be1875"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" DROP CONSTRAINT "FK_eb6e8b786285e75855013247569"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" DROP CONSTRAINT "FK_9bf4f1d3e78ce525a91b7b7edc5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subgenres" DROP CONSTRAINT "FK_e0c3a62facdefc5914a962556c5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_subgenres" DROP CONSTRAINT "FK_a6bca6be1b1c64184b9aa419bf0"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f2ac93cdeec95afae4b7a4713c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_213a2c1dec9b314426a1750e0b"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_13ffc7aeaa64e35064e7015d82"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c35f1969374cdc0b4ad86be187"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb6e8b786285e7585501324756"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bf4f1d3e78ce525a91b7b7edc"`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."movies_genres_enum" AS ENUM('animacion', 'antropologico', 'aventura', 'biografico', 'ciencia_ficcion', 'cine_guerrilla', 'comedia', 'deportivo', 'drama', 'etnografico', 'experimental', 'familiar', 'fantastico', 'genero', 'historico', 'infantil', 'medioambiente', 'musical', 'policial', 'religioso', 'resistencia', 'romance', 'suspenso', 'terror', 'thriller', 'vida_rural', 'western', 'otros')`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies" ADD "genres" "public"."movies_genres_enum" array NOT NULL`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e0c3a62facdefc5914a962556c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a6bca6be1b1c64184b9aa419bf"`,
    )
    await queryRunner.query(`DROP TABLE "movies_subgenres"`)
    await queryRunner.query(`DROP TABLE "subgenres"`)
    await queryRunner.query(
      `CREATE INDEX "IDX_d89a5330076eff19a3cb6a1a3a" ON "movies_cities" ("cityId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_955404a5353c436e397f3131d3" ON "movies_cities" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_463bc547129a23f8ca3d3aae2d" ON "movies_provinces" ("provinceId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2b3aa1267e6a7fbde92b0c5d6f" ON "movies_provinces" ("movieId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5a9997ed49cb1786c58a8a1c16" ON "movies_languages" ("languageId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_006d624c816ba35bd454e24242" ON "movies_languages" ("movieId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" ADD CONSTRAINT "FK_955404a5353c436e397f3131d32" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_cities" ADD CONSTRAINT "FK_d89a5330076eff19a3cb6a1a3ae" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" ADD CONSTRAINT "FK_2b3aa1267e6a7fbde92b0c5d6fc" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_provinces" ADD CONSTRAINT "FK_463bc547129a23f8ca3d3aae2d5" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" ADD CONSTRAINT "FK_5a9997ed49cb1786c58a8a1c166" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_languages" ADD CONSTRAINT "FK_006d624c816ba35bd454e24242d" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }
}
