import { MigrationInterface, QueryRunner } from 'typeorm'

interface SeedItem {
  code: string
  name: string
}

export class ExpandCatalogSeeds1739000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure base tables exist (in case this runs on a DB missing earlier seed migration)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id serial PRIMARY KEY,
        code varchar(10) UNIQUE NOT NULL,
        name varchar(100) NOT NULL
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id serial PRIMARY KEY,
        code varchar(5) UNIQUE NOT NULL,
        name varchar(100) NOT NULL
      )
    `)

    const languages: SeedItem[] = [
      { code: 'es', name: 'Espanol' },
      { code: 'en', name: 'Ingles' },
      { code: 'fr', name: 'Frances' },
      { code: 'pt', name: 'Portugues' },
      { code: 'qu', name: 'Kichwa' },
      { code: 'de', name: 'Aleman' },
      { code: 'it', name: 'Italiano' },
      { code: 'zh', name: 'Chino' },
      { code: 'ja', name: 'Japones' },
      { code: 'ru', name: 'Ruso' },
      { code: 'ar', name: 'Arabe' },
      { code: 'hi', name: 'Hindi' },
      { code: 'sw', name: 'Suajili' },
      { code: 'nl', name: 'Neerlandes' },
      { code: 'sv', name: 'Sueco' },
      { code: 'no', name: 'Noruego' },
      { code: 'da', name: 'Danes' },
      { code: 'fi', name: 'Filandes' },
      { code: 'tr', name: 'Turco' },
      { code: 'pl', name: 'Polaco' },
      { code: 'el', name: 'Griego' },
      { code: 'he', name: 'Hebreo' },
      { code: 'ko', name: 'Coreano' },
      { code: 'th', name: 'Tailandes' },
      { code: 'vi', name: 'Vietnamita' },
    ]

    for (const lang of languages) {
      await queryRunner.query(
        `INSERT INTO languages (code, name) VALUES ($1, $2)
         ON CONFLICT (code) DO NOTHING`,
        [lang.code, lang.name],
      )
    }

    const countries: SeedItem[] = [
      { code: 'EC', name: 'Ecuador' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CO', name: 'Colombia' },
      { code: 'MX', name: 'Mexico' },
      { code: 'ES', name: 'Espana' },
      { code: 'BR', name: 'Brasil' },
      { code: 'CL', name: 'Chile' },
      { code: 'PE', name: 'Peru' },
      { code: 'BO', name: 'Bolivia' },
      { code: 'PY', name: 'Paraguay' },
      { code: 'UY', name: 'Uruguay' },
      { code: 'VE', name: 'Venezuela' },
      { code: 'CA', name: 'Canada' },
      { code: 'GB', name: 'Reino Unido' },
      { code: 'IE', name: 'Irlanda' },
      { code: 'FR', name: 'Francia' },
      { code: 'DE', name: 'Alemania' },
      { code: 'IT', name: 'Italia' },
      { code: 'NL', name: 'Paises Bajos' },
      { code: 'BE', name: 'Belgica' },
      { code: 'SE', name: 'Suecia' },
      { code: 'NO', name: 'Noruega' },
      { code: 'DK', name: 'Dinamarca' },
      { code: 'FI', name: 'Finlandia' },
      { code: 'CH', name: 'Suiza' },
      { code: 'PT', name: 'Portugal' },
      { code: 'AU', name: 'Australia' },
      { code: 'NZ', name: 'Nueva Zelanda' },
      { code: 'ZA', name: 'Sudafrica' },
      { code: 'NG', name: 'Nigeria' },
      { code: 'KE', name: 'Kenia' },
      { code: 'JP', name: 'Japon' },
      { code: 'CN', name: 'China' },
      { code: 'KR', name: 'Corea del Sur' },
      { code: 'IN', name: 'India' },
      { code: 'SG', name: 'Singapur' },
      { code: 'AE', name: 'Emiratos Arabes Unidos' },
      { code: 'SA', name: 'Arabia Saudita' },
      { code: 'IL', name: 'Israel' },
    ]

    for (const country of countries) {
      await queryRunner.query(
        `INSERT INTO countries (code, name) VALUES ($1, $2)
         ON CONFLICT (code) DO NOTHING`,
        [country.code, country.name],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const languageCodes = [
      'es',
      'en',
      'fr',
      'pt',
      'qu',
      'de',
      'it',
      'zh',
      'ja',
      'ru',
      'ar',
      'hi',
      'sw',
      'nl',
      'sv',
      'no',
      'da',
      'fi',
      'tr',
      'pl',
      'el',
      'he',
      'ko',
      'th',
      'vi',
    ]
    const countryCodes = [
      'EC',
      'US',
      'AR',
      'CO',
      'MX',
      'ES',
      'BR',
      'CL',
      'PE',
      'BO',
      'PY',
      'UY',
      'VE',
      'CA',
      'GB',
      'IE',
      'FR',
      'DE',
      'IT',
      'NL',
      'BE',
      'SE',
      'NO',
      'DK',
      'FI',
      'CH',
      'PT',
      'AU',
      'NZ',
      'ZA',
      'NG',
      'KE',
      'JP',
      'CN',
      'KR',
      'IN',
      'SG',
      'AE',
      'SA',
      'IL',
    ]

    await queryRunner.query(
      `DELETE FROM languages WHERE code = ANY($1::text[])`,
      [languageCodes],
    )

    await queryRunner.query(
      `DELETE FROM countries WHERE code = ANY($1::text[])`,
      [countryCodes],
    )
  }
}
