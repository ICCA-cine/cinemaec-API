import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProfilesTable1733000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_profile',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fullName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'legalName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'tradeName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'legalStatus',
            type: 'enum',
            enum: ['natural_person', 'legal_entity'],
            isNullable: false,
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'province',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'agreementDocumentId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'hasUploadedAgreement',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
            isUnique: true,
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
          {
            columnNames: ['agreementDocumentId'],
            referencedTableName: 'assets',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
        indices: [
          {
            columnNames: ['userId'],
            isUnique: true,
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_profile')
  }
}
