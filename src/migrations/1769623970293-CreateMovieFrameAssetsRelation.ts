import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMovieFrameAssetsRelation1769623970293
  implements MigrationInterface
{
  name = 'CreateMovieFrameAssetsRelation1769623970293'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasFrameAssetId = await queryRunner.hasColumn('movies', 'frameAssetId')
    if (hasFrameAssetId) {
      // Primero eliminar la constraint
      try {
        await queryRunner.query(
          `ALTER TABLE "movies" DROP CONSTRAINT IF EXISTS "FK_e5fd602bd941753e6f8fa89d9ee"`,
        )
      } catch (e) {
        // La constraint puede no existir
      }
      
      await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN IF EXISTS "frameAssetId"`)
    }
    
    const hasTable = await queryRunner.hasTable('movies_frame_assets')
    if (!hasTable) {
      await queryRunner.query(
        `CREATE TABLE "movies_frame_assets" ("movieId" integer NOT NULL, "assetId" integer NOT NULL, CONSTRAINT "PK_e1e0302a6446c1ba508f82aae8b" PRIMARY KEY ("movieId", "assetId"))`,
      )
      
      await queryRunner.query(
        `CREATE INDEX "IDX_662900148a35259fdc5afa1c72" ON "movies_frame_assets" ("movieId") `,
      )
      await queryRunner.query(
        `CREATE INDEX "IDX_14801dce254e9eb93945b62563" ON "movies_frame_assets" ("assetId") `,
      )
      
      await queryRunner.query(
        `ALTER TABLE "movies_frame_assets" ADD CONSTRAINT "FK_662900148a35259fdc5afa1c728" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      )
      await queryRunner.query(
        `ALTER TABLE "movies_frame_assets" ADD CONSTRAINT "FK_14801dce254e9eb93945b625635" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies_frame_assets" DROP CONSTRAINT IF EXISTS "FK_14801dce254e9eb93945b625635"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movies_frame_assets" DROP CONSTRAINT IF EXISTS "FK_662900148a35259fdc5afa1c728"`,
    )
    await queryRunner.query(`ALTER TABLE "movies" ADD "frameAssetId" integer`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_14801dce254e9eb93945b62563"`,
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_662900148a35259fdc5afa1c72"`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "movies_frame_assets"`)
    await queryRunner.query(
      `ALTER TABLE "movies" ADD CONSTRAINT "FK_e5fd602bd941753e6f8fa89d9ee" FOREIGN KEY ("frameAssetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }
}
