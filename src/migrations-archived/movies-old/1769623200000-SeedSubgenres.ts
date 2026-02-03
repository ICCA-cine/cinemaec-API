import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedSubgenres1769623200000 implements MigrationInterface {
  name = 'SeedSubgenres1769623200000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const subgenres = [
      'Animación',
      'Antropológico',
      'Aventura',
      'Biográfico',
      'Ciencia Ficción',
      'Cine Guerrilla',
      'Comedia',
      'Deportivo',
      'Drama',
      'Etnográfico',
      'Experimental',
      'Familiar',
      'Fantástico',
      'Género',
      'Histórico',
      'Infantil',
      'Medioambiente',
      'Musical',
      'Policial',
      'Religioso',
      'Resistencia',
      'Romance',
      'Suspenso',
      'Terror',
      'Thriller',
      'Vida rural',
      'Western',
      'Otros',
    ]

    for (const name of subgenres) {
      await queryRunner.query(
        `INSERT INTO "subgenres" ("name") VALUES ($1) ON CONFLICT ("name") DO NOTHING`,
        [name],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const subgenres = [
      'Animación',
      'Antropológico',
      'Aventura',
      'Biográfico',
      'Ciencia Ficción',
      'Cine Guerrilla',
      'Comedia',
      'Deportivo',
      'Drama',
      'Etnográfico',
      'Experimental',
      'Familiar',
      'Fantástico',
      'Género',
      'Histórico',
      'Infantil',
      'Medioambiente',
      'Musical',
      'Policial',
      'Religioso',
      'Resistencia',
      'Romance',
      'Suspenso',
      'Terror',
      'Thriller',
      'Vida rural',
      'Western',
      'Otros',
    ]

    for (const name of subgenres) {
      await queryRunner.query(`DELETE FROM "subgenres" WHERE "name" = $1`, [
        name,
      ])
    }
  }
}
