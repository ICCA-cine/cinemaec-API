import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCinematicRolesTable1769792179842
  implements MigrationInterface
{
  name = 'CreateCinematicRolesTable1769792179842'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" RENAME COLUMN "role" TO "cinematicRoleId"`,
    )
    await queryRunner.query(
      `ALTER TYPE "public"."movie_professionals_role_enum" RENAME TO "movie_professionals_cinematicroleid_enum"`,
    )
    await queryRunner.query(
      `CREATE TABLE "cinematic_roles" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6cea270a7abb60b6062cc3ae7a" UNIQUE ("name"), CONSTRAINT "PK_34a0b58e8ecbe0bc7de64d34ed4" PRIMARY KEY ("id"))`,
    )

    // Insertar roles cinematográficos
    await queryRunner.query(`
            INSERT INTO "cinematic_roles" ("name") VALUES
            ('Director/a/e'),
            ('Productor/a/e'),
            ('Guionista/e'),
            ('Director/a/e de fotografía'),
            ('Jefe eléctricos'),
            ('Director/a/e de arte'),
            ('Vestuarista'),
            ('Maquillista'),
            ('Efectos especiales'),
            ('Sonidista'),
            ('Editor/Montajista'),
            ('Posproductor de sonido'),
            ('Música'),
            ('Composición musical'),
            ('Banda sonora'),
            ('Colorista'),
            ('Animación'),
            ('Asistente de dirección'),
            ('Foquista')
        `)

    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN IF EXISTS "cinematicRoleId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "cinematicRoleId" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD CONSTRAINT "FK_3d0e0038796b1f7d751d74b42a3" FOREIGN KEY ("cinematicRoleId") REFERENCES "cinematic_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP CONSTRAINT IF EXISTS "FK_3d0e0038796b1f7d751d74b42a3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN IF EXISTS "cinematicRoleId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "cinematicRoleId" "public"."movie_professionals_cinematicroleid_enum" NOT NULL`,
    )
    await queryRunner.query(`DROP TABLE IF EXISTS "cinematic_roles"`)
    await queryRunner.query(
      `ALTER TYPE "public"."movie_professionals_cinematicroleid_enum" RENAME TO "movie_professionals_role_enum"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" RENAME COLUMN "cinematicRoleId" TO "role"`,
    )
  }
}
