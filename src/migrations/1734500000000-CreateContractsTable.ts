import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateContractsTable1734500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contracts',
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
            name: 'adminName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'spaceId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'contractType',
            type: 'enum',
            enum: ['space', 'content_bank_user', 'diplomatic_mission', 'other'],
            isNullable: false,
          },
          {
            name: 'documentUrl',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'expirationDate',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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
            columnNames: ['userId'],
          },
          {
            columnNames: ['spaceId'],
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contracts')
  }
}
