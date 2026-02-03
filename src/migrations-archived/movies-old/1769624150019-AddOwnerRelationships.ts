import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOwnerRelationships1769624150019 implements MigrationInterface {
  name = 'AddOwnerRelationships1769624150019'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_c9ece91a901505050b4a2a651f8" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assets" ADD CONSTRAINT "FK_2c5ac0d6fb58b238fd2068de67d" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "companies" ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "FK_6dcdcbb7d72f64602307ec4ab39"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assets" DROP CONSTRAINT IF EXISTS "FK_2c5ac0d6fb58b238fd2068de67d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT IF EXISTS "FK_c9ece91a901505050b4a2a651f8"`,
    )
  }
}
