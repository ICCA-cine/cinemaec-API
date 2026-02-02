import { MigrationInterface, QueryRunner, Table } from 'typeorm'

interface ProvinceSeed {
  name: string
  cities: string[]
}

export class CreateGeoAndLanguageTables1738000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'languages',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '10',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'countries',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '5',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
        ],
      }),
      true,
    )

    await queryRunner.createTable(
      new Table({
        name: 'provinces',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'countryId',
            type: 'int',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['countryId'],
            referencedTableName: 'countries',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    )

    // Ensure column and FK exist if table was previously created without them
    await queryRunner.query(
      'ALTER TABLE provinces ADD COLUMN IF NOT EXISTS "countryId" int',
    )
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'provinces'
            AND kcu.column_name = 'countryId'
        ) THEN
          ALTER TABLE provinces
          ADD CONSTRAINT fk_provinces_country FOREIGN KEY ("countryId") REFERENCES countries(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `)

    await queryRunner.createTable(
      new Table({
        name: 'cities',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'provinceId',
            type: 'int',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['provinceId'],
            referencedTableName: 'provinces',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    )

    await queryRunner.query(
      'ALTER TABLE cities ADD COLUMN IF NOT EXISTS "provinceId" int',
    )
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'cities'
            AND kcu.column_name = 'provinceId'
        ) THEN
          ALTER TABLE cities
          ADD CONSTRAINT fk_cities_province FOREIGN KEY ("provinceId") REFERENCES provinces(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `)

    // Seed languages
    const languages = [
      { code: 'es', name: 'Espanol' },
      { code: 'en', name: 'Ingles' },
      { code: 'fr', name: 'Frances' },
      { code: 'pt', name: 'Portugues' },
      { code: 'qu', name: 'Kichwa' },
    ]

    for (const lang of languages) {
      await queryRunner.query(
        `INSERT INTO languages (code, name) VALUES ($1, $2)
         ON CONFLICT (code) DO NOTHING`,
        [lang.code, lang.name],
      )
    }

    // Seed countries
    const countries = [
      { code: 'EC', name: 'Ecuador' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CO', name: 'Colombia' },
      { code: 'MX', name: 'Mexico' },
      { code: 'ES', name: 'Espana' },
    ]

    for (const country of countries) {
      await queryRunner.query(
        `INSERT INTO countries (code, name) VALUES ($1, $2)
         ON CONFLICT (code) DO NOTHING`,
        [country.code, country.name],
      )
    }

    // Seed provinces and cities (Ecuador only)
    const ecuadorIdResult = await queryRunner.query(
      `SELECT id FROM countries WHERE code = 'EC' LIMIT 1`,
    )
    const ecuadorId = ecuadorIdResult?.[0]?.id

    if (!ecuadorId) {
      throw new Error('Ecuador country seed was not created')
    }

    const provinceSeeds: ProvinceSeed[] = [
      {
        name: 'Azuay',
        cities: ['Cuenca', 'Gualaceo', 'Paute', 'Chordeleg'],
      },
      {
        name: 'Bolivar',
        cities: ['Guaranda', 'San Miguel', 'Chillanes'],
      },
      {
        name: 'Canar',
        cities: ['Azogues', 'Biblian', 'Canar'],
      },
      {
        name: 'Carchi',
        cities: ['Tulcan', 'Bolivar', 'San Gabriel'],
      },
      {
        name: 'Chimborazo',
        cities: ['Riobamba', 'Guano', 'Alausi'],
      },
      {
        name: 'Cotopaxi',
        cities: ['Latacunga', 'Pujili', 'Salcedo'],
      },
      {
        name: 'El Oro',
        cities: ['Machala', 'Pasaje', 'Santa Rosa'],
      },
      {
        name: 'Esmeraldas',
        cities: ['Esmeraldas', 'Atacames', 'Quininde'],
      },
      {
        name: 'Galapagos',
        cities: ['Puerto Ayora', 'Puerto Baquerizo Moreno', 'Puerto Villamil'],
      },
      {
        name: 'Guayas',
        cities: ['Guayaquil', 'Daule', 'Samborondon', 'Duran'],
      },
      {
        name: 'Imbabura',
        cities: ['Ibarra', 'Otavalo', 'Cotacachi'],
      },
      {
        name: 'Loja',
        cities: ['Loja', 'Catamayo', 'Macara'],
      },
      {
        name: 'Los Rios',
        cities: ['Babahoyo', 'Quevedo', 'Ventanas'],
      },
      {
        name: 'Manabi',
        cities: ['Portoviejo', 'Manta', 'Chone'],
      },
      {
        name: 'Morona Santiago',
        cities: ['Macas', 'Sucua', 'Gualaquiza'],
      },
      {
        name: 'Napo',
        cities: ['Tena', 'Archidona', 'El Chaco'],
      },
      {
        name: 'Orellana',
        cities: ['Francisco de Orellana', 'La Joya de los Sachas'],
      },
      {
        name: 'Pastaza',
        cities: ['Puyo', 'Mera', 'Santa Clara'],
      },
      {
        name: 'Pichincha',
        cities: ['Quito', 'Cayambe', 'Ruminahui'],
      },
      {
        name: 'Santa Elena',
        cities: ['Santa Elena', 'La Libertad', 'Salinas'],
      },
      {
        name: 'Santo Domingo de los Tsachilas',
        cities: ['Santo Domingo'],
      },
      {
        name: 'Sucumbios',
        cities: ['Nueva Loja', 'Shushufindi', 'Cuyabeno'],
      },
      {
        name: 'Tungurahua',
        cities: ['Ambato', 'Banos', 'Pelileo'],
      },
      {
        name: 'Zamora Chinchipe',
        cities: ['Zamora', 'Yantzaza', 'Zumba'],
      },
    ]

    for (const province of provinceSeeds) {
      const existingProvince = await queryRunner.query(
        `SELECT id FROM provinces WHERE name = $1 AND "countryId" = $2 LIMIT 1`,
        [province.name, ecuadorId],
      )

      let provinceId = existingProvince?.[0]?.id

      if (!provinceId) {
        const provinceInsert = await queryRunner.query(
          `INSERT INTO provinces (name, "countryId") VALUES ($1, $2) RETURNING id`,
          [province.name, ecuadorId],
        )
        provinceId = provinceInsert?.[0]?.id
      }

      if (!provinceId) {
        throw new Error(`Province ${province.name} was not created`)
      }

      for (const city of province.cities) {
        const existingCity = await queryRunner.query(
          `SELECT id FROM cities WHERE name = $1 AND "provinceId" = $2 LIMIT 1`,
          [city, provinceId],
        )

        if (!existingCity?.[0]?.id) {
          await queryRunner.query(
            `INSERT INTO cities (name, "provinceId") VALUES ($1, $2)`,
            [city, provinceId],
          )
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cities')
    await queryRunner.dropTable('provinces')
    await queryRunner.dropTable('countries')
    await queryRunner.dropTable('languages')
  }
}
