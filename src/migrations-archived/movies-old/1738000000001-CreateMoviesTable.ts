import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateMoviesTable1738000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "movie_type" AS ENUM('cortometraje','mediometraje','largometraje')`,
    )

    await queryRunner.query(`
      CREATE TYPE "movie_genre" AS ENUM(
        'animacion','antropologico','aventura','biografico','ciencia_ficcion','cine_guerrilla','comedia','deportivo','drama','etnografico','experimental','familiar','fantastico','genero','historico','infantil','medioambiente','musical','policial','religioso','resistencia','romance','suspenso','terror','thriller','vida_rural','western','otros'
      )
    `)

    await queryRunner.query(
      `CREATE TYPE "movie_classification" AS ENUM('todo_publico','recomendado_0_6','recomendado_6_12','menores_12_supervision','mayores_12','mayores_15','solo_mayores_18')`,
    )

    await queryRunner.query(
      `CREATE TYPE "project_status" AS ENUM('desarrollo','produccion','post_produccion','distribucion','finalizado')`,
    )

    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar', length: '255', isNullable: false },
          { name: 'titleEn', type: 'varchar', length: '255', isNullable: true },
          { name: 'durationMinutes', type: 'int', isNullable: false },
          { name: 'type', type: 'movie_type', isNullable: false },
          {
            name: 'genres',
            type: 'movie_genre',
            isArray: true,
            isNullable: false,
          },
          { name: 'releaseYear', type: 'int', isNullable: false },
          { name: 'synopsis', type: 'text', isNullable: false },
          { name: 'synopsisEn', type: 'text', isNullable: true },
          { name: 'logline', type: 'text', isNullable: true },
          { name: 'loglineEn', type: 'text', isNullable: true },
          {
            name: 'classification',
            type: 'movie_classification',
            isNullable: false,
          },
          { name: 'projectStatus', type: 'project_status', isNullable: false },
          {
            name: 'totalBudget',
            type: 'numeric',
            precision: 14,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'economicRecovery',
            type: 'numeric',
            precision: 14,
            scale: 2,
            isNullable: true,
          },
          { name: 'spectatorsCount', type: 'int', isNullable: true },
          { name: 'crewTotal', type: 'int', isNullable: true },
          { name: 'actorsTotal', type: 'int', isNullable: true },
          { name: 'projectNeed', type: 'text', isNullable: true },
          { name: 'projectNeedEn', type: 'text', isNullable: true },
          { name: 'posterAssetId', type: 'int', isNullable: true },
          { name: 'frameAssetId', type: 'int', isNullable: true },
          { name: 'dossierAssetId', type: 'int', isNullable: true },
          {
            name: 'trailerLink',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'makingOfLink',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          { name: 'countryId', type: 'int', isNullable: false },
          { name: 'provinceId', type: 'int', isNullable: true },
          { name: 'createdById', type: 'int', isNullable: false },
          { name: 'ownerId', type: 'int', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', isNullable: true },
        ],
        foreignKeys: [
          {
            columnNames: ['countryId'],
            referencedTableName: 'countries',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['provinceId'],
            referencedTableName: 'provinces',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['createdById'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['ownerId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['posterAssetId'],
            referencedTableName: 'assets',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['frameAssetId'],
            referencedTableName: 'assets',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['dossierAssetId'],
            referencedTableName: 'assets',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'movies_languages',
        columns: [
          { name: 'movieId', type: 'int', isPrimary: true },
          { name: 'languageId', type: 'int', isPrimary: true },
        ],
        foreignKeys: [
          {
            columnNames: ['movieId'],
            referencedTableName: 'movies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['languageId'],
            referencedTableName: 'languages',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'movies_cities',
        columns: [
          { name: 'movieId', type: 'int', isPrimary: true },
          { name: 'cityId', type: 'int', isPrimary: true },
        ],
        foreignKeys: [
          {
            columnNames: ['movieId'],
            referencedTableName: 'movies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['cityId'],
            referencedTableName: 'cities',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movies_cities')
    await queryRunner.dropTable('movies_languages')
    await queryRunner.dropTable('movies')
    await queryRunner.query('DROP TYPE IF EXISTS IF EXISTS "project_status"')
    await queryRunner.query('DROP TYPE IF EXISTS IF EXISTS "movie_classification"')
    await queryRunner.query('DROP TYPE IF EXISTS IF EXISTS "movie_genre"')
    await queryRunner.query('DROP TYPE IF EXISTS IF EXISTS "movie_type"')
  }
}
