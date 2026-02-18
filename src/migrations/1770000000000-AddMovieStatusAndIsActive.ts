import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddMovieStatusAndIsActive1770000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'movies',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['draft', 'in_review', 'approved', 'rejected', 'archived'],
        default: "'draft'",
        isNullable: false,
      }),
    )

    await queryRunner.addColumn(
      'movies',
      new TableColumn({
        name: 'isActive',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('movies', 'isActive')
    await queryRunner.dropColumn('movies', 'status')
  }
}
