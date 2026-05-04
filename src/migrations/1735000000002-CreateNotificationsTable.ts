import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateNotificationsTable1735000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['info', 'success', 'warning', 'error'],
            default: "'info'",
          },
          {
            name: 'isRead',
            type: 'boolean',
            default: false,
          },
          {
            name: 'link',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'referenceType',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'referenceId',
            type: 'int',
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
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_NOTIFICATIONS_USER_ID',
            columnNames: ['userId'],
          },
          {
            name: 'IDX_NOTIFICATIONS_IS_READ',
            columnNames: ['isRead'],
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications')
  }
}
