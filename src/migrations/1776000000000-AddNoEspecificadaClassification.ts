import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNoEspecificadaClassification1776000000000
  implements MigrationInterface
{
  name = 'AddNoEspecificadaClassification1776000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'no_especificada' value to the movies_classification_enum
    await queryRunner.query(
      `ALTER TYPE "public"."movies_classification_enum" ADD VALUE IF NOT EXISTS 'no_especificada'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL doesn't allow removing values from enums directly
    // This would require renaming the type and creating a new one
    // For now, we'll leave it in place
    // If you need to fully rollback, you'd need to:
    // 1. Rename the old enum type
    // 2. Create a new enum without 'no_especificada'
    // 3. Convert all columns using the old type to use the new one
    // 4. Drop the old type
  }
}
