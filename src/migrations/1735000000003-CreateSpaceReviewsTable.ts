import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSpaceReviewsTable1735000000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'space_reviews',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'spaceId', type: 'int', isNullable: false },
          { name: 'reviewerUserId', type: 'int', isNullable: false },
          {
            name: 'decision',
            type: 'enum',
            enum: ['approve', 'request_changes', 'reject'],
            isNullable: false,
          },
          { name: 'generalComment', type: 'text', isNullable: true },
          { name: 'issues', type: 'jsonb', isNullable: true },
          {
            name: 'resolved',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'resolvedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['spaceId'],
            referencedTableName: 'spaces',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['reviewerUserId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        indices: [
          { name: 'IDX_SPACE_REVIEWS_SPACE_ID', columnNames: ['spaceId'] },
          { name: 'IDX_SPACE_REVIEWS_CREATED_AT', columnNames: ['createdAt'] },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('space_reviews')
  }
}
