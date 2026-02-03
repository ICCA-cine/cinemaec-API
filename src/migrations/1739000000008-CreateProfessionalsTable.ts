import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateProfessionalsTable1739000000008
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('professionals')
    if (hasTable) {
      return
    }

    // Crear tipo ENUM solo si no existe
    const typeExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'gender_enum'
      )
    `)
    
    if (!typeExists[0].exists) {
      await queryRunner.query(
        `CREATE TYPE "gender_enum" AS ENUM('masculino', 'femenino')`,
      )
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "professionals" (
        "id" SERIAL PRIMARY KEY,
        "nombres" varchar(100) NOT NULL,
        "apellidos" varchar(100) NOT NULL,
        "cedula" varchar(20),
        "sexo" "gender_enum" NOT NULL,
        "email" varchar(255),
        "telefono" varchar(20),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );
    `)

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_professionals_cedula" ON "professionals"("cedula")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_professionals_email" ON "professionals"("email")`,
    )

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_professionals_apellidos" ON "professionals"("apellidos")`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_professionals_apellidos"`)
    await queryRunner.query(`DROP INDEX "idx_professionals_email"`)
    await queryRunner.query(`DROP INDEX "idx_professionals_cedula"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "professionals"`)
    await queryRunner.query(`DROP TYPE "gender_enum"`)
  }
}
