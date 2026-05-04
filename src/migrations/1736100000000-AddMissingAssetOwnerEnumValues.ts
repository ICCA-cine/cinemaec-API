import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMissingAssetOwnerEnumValues1736100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar valores faltantes al enum asset_owner_enum
    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'space_document'
    `)

    await queryRunner.query(`
      ALTER TYPE "asset_owner_enum" ADD VALUE IF NOT EXISTS 'user_agreement'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No se pueden eliminar valores de enums en PostgreSQL de forma directa
    // Se requeriría recrear el enum completamente, lo cual es complejo
    // Por seguridad, dejamos el down vacío
    console.log(
      'Cannot remove enum values from PostgreSQL. Manual intervention required if rollback needed.',
    )
  }
}
