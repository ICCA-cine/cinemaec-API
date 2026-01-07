import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateSpacesTable1733500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'spaces',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'theater',
              'cinema',
              'cultural_center',
              'multipurpose',
              'other',
            ],
            isNullable: false,
          },
          {
            name: 'province',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'coordinates',
            type: 'numeric',
            precision: 10,
            scale: 7,
            isArray: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'target',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'managerName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'managerPhone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'managerEmail',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'technicianInCharge',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'technicianRole',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'technicianPhone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'technicianEmail',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'capacity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'projectionEquipment',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'soundEquipment',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'screen',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'boxofficeRegistration',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'accessibilities',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'services',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'operatingHistory',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'mainActivity',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'otherActivities',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'commercialActivities',
            type: 'text',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'logoId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'photosId',
            type: 'int',
            isArray: true,
            isNullable: false,
          },
          {
            name: 'ciDocument',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'rucDocument',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'managerDocument',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'serviceBill',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'operatingLicense',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'contractId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'pending',
              'verified',
              'rejected',
              'active',
              'inactive',
              'under_review',
            ],
            default: "'pending'",
          },
          {
            name: 'userId',
            type: 'int',
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
            columnNames: ['status'],
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('spaces')
  }
}
