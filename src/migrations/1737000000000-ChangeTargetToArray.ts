import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ChangeTargetToArray1737000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primero agregar una columna temporal
    await queryRunner.addColumn(
      'spaces',
      new TableColumn({
        name: 'target_temp',
        type: 'text',
        isArray: true,
        isNullable: true,
      }),
    )

    // Migrar datos existentes: convertir string a array
    await queryRunner.query(`
      UPDATE spaces 
      SET target_temp = ARRAY[target]::text[] 
      WHERE target IS NOT NULL AND target != ''
    `)

    // Para valores vacíos o null, poner un array vacío
    await queryRunner.query(`
      UPDATE spaces 
      SET target_temp = ARRAY[]::text[] 
      WHERE target IS NULL OR target = ''
    `)

    // Eliminar columna antigua
    await queryRunner.dropColumn('spaces', 'target')

    // Renombrar columna temporal
    await queryRunner.renameColumn('spaces', 'target_temp', 'target')

    // Ahora hacer la columna NOT NULL
    await queryRunner.query(`
      ALTER TABLE spaces 
      ALTER COLUMN target SET NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna temporal varchar
    await queryRunner.addColumn(
      'spaces',
      new TableColumn({
        name: 'target_temp',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    )

    // Convertir array a string (tomar primer elemento o vacío)
    await queryRunner.query(`
      UPDATE spaces 
      SET target_temp = target[1]
      WHERE target IS NOT NULL AND array_length(target, 1) > 0
    `)

    // Eliminar columna array
    await queryRunner.dropColumn('spaces', 'target')

    // Renombrar columna temporal
    await queryRunner.renameColumn('spaces', 'target_temp', 'target')

    // Hacer NOT NULL
    await queryRunner.query(`
      ALTER TABLE spaces 
      ALTER COLUMN target SET NOT NULL
    `)
  }
}
