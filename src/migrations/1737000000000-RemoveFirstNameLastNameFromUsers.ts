import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class RemoveFirstNameLastNameFromUsers1737000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si las columnas existen antes de intentar eliminarlas
    const table = await queryRunner.getTable('users')
    
    if (table) {
      const firstNameColumn = table.findColumnByName('firstName')
      const lastNameColumn = table.findColumnByName('lastName')

      // Eliminar firstName si existe
      if (firstNameColumn) {
        await queryRunner.dropColumn('users', 'firstName')
      }

      // Eliminar lastName si existe
      if (lastNameColumn) {
        await queryRunner.dropColumn('users', 'lastName')
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaurar las columnas en caso de rollback
    const table = await queryRunner.getTable('users')
    
    if (table) {
      const firstNameColumn = table.findColumnByName('firstName')
      const lastNameColumn = table.findColumnByName('lastName')

      // Restaurar firstName si no existe
      if (!firstNameColumn) {
        await queryRunner.addColumn(
          'users',
          new TableColumn({
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          }),
        )
      }

      // Restaurar lastName si no existe
      if (!lastNameColumn) {
        await queryRunner.addColumn(
          'users',
          new TableColumn({
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          }),
        )
      }
    }
  }
}
