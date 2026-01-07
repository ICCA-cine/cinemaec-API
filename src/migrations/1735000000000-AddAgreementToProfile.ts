import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAgreementToProfile1735000000000 implements MigrationInterface {
  name = 'AddAgreementToProfile1735000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar el valor user_agreement al enum assets_ownertype_enum si no existe
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t 
          JOIN pg_enum e ON t.oid = e.enumtypid 
          WHERE t.typname = 'assets_ownertype_enum' AND e.enumlabel = 'user_agreement') THEN
          ALTER TYPE assets_ownertype_enum ADD VALUE 'user_agreement';
        END IF;
      END $$;
    `)

    // Agregar columnas a la tabla users_profile solo si no existen (para BD antiguas)
    const profileTable = await queryRunner.hasTable('users_profile')
    if (profileTable) {
      const profileTableObj = await queryRunner.getTable('users_profile')

      // Agregar agreementDocumentId si no existe
      if (!profileTableObj?.findColumnByName('agreementDocumentId')) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          ADD COLUMN "agreementDocumentId" integer NULL
        `)
      }

      // Agregar hasUploadedAgreement si no existe
      if (!profileTableObj?.findColumnByName('hasUploadedAgreement')) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          ADD COLUMN "hasUploadedAgreement" boolean NOT NULL DEFAULT false
        `)
      }

      // Agregar foreign key si no existe
      const hasFk = (profileTableObj?.foreignKeys || []).some((fk) =>
        fk.columnNames.includes('agreementDocumentId'),
      )
      if (!hasFk) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          ADD CONSTRAINT "FK_agreement_document" 
          FOREIGN KEY ("agreementDocumentId") 
          REFERENCES "assets"("id") 
          ON DELETE SET NULL 
          ON UPDATE NO ACTION
        `)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const profileTable = await queryRunner.hasTable('users_profile')
    if (profileTable) {
      const profileTableObj = await queryRunner.getTable('users_profile')

      // Eliminar foreign key si existe
      const fk = (profileTableObj?.foreignKeys || []).find((f) =>
        f.columnNames.includes('agreementDocumentId'),
      )
      if (fk) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          DROP CONSTRAINT "${fk.name}"
        `)
      }

      // Eliminar columnas si existen
      if (profileTableObj?.findColumnByName('hasUploadedAgreement')) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          DROP COLUMN "hasUploadedAgreement"
        `)
      }

      if (profileTableObj?.findColumnByName('agreementDocumentId')) {
        await queryRunner.query(`
          ALTER TABLE "users_profile" 
          DROP COLUMN "agreementDocumentId"
        `)
      }
    }

    // Nota: No eliminamos el valor del enum porque PostgreSQL no permite eliminar valores de enums
    // Si se requiere eliminar, se debe crear un nuevo enum sin ese valor y hacer la conversión
  }
}
