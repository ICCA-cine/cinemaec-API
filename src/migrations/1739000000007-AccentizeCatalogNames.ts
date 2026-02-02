import { MigrationInterface, QueryRunner } from 'typeorm'

export class AccentizeCatalogNames1739000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const languageUpdates: Array<[string, string]> = [
      ['es', 'Español'],
      ['en', 'Inglés'],
      ['fr', 'Francés'],
      ['pt', 'Portugués'],
      ['qu', 'Kichwa'],
      ['de', 'Alemán'],
      ['it', 'Italiano'],
      ['zh', 'Chino'],
      ['ja', 'Japonés'],
      ['ru', 'Ruso'],
      ['ar', 'Árabe'],
      ['hi', 'Hindi'],
      ['sw', 'Suajili'],
      ['nl', 'Neerlandés'],
      ['sv', 'Sueco'],
      ['no', 'Noruego'],
      ['da', 'Danés'],
      ['fi', 'Finlandés'],
      ['tr', 'Turco'],
      ['pl', 'Polaco'],
      ['el', 'Griego'],
      ['he', 'Hebreo'],
      ['ko', 'Coreano'],
      ['th', 'Tailandés'],
      ['vi', 'Vietnamita'],
    ]

    for (const [code, name] of languageUpdates) {
      await queryRunner.query(
        `UPDATE languages SET name = $2 WHERE code = $1`,
        [code, name],
      )
    }

    const countryUpdates: Array<[string, string]> = [
      ['EC', 'Ecuador'],
      ['US', 'Estados Unidos'],
      ['AR', 'Argentina'],
      ['CO', 'Colombia'],
      ['MX', 'México'],
      ['ES', 'España'],
      ['BR', 'Brasil'],
      ['CL', 'Chile'],
      ['PE', 'Perú'],
      ['BO', 'Bolivia'],
      ['PY', 'Paraguay'],
      ['UY', 'Uruguay'],
      ['VE', 'Venezuela'],
      ['CA', 'Canadá'],
      ['GB', 'Reino Unido'],
      ['IE', 'Irlanda'],
      ['FR', 'Francia'],
      ['DE', 'Alemania'],
      ['IT', 'Italia'],
      ['NL', 'Países Bajos'],
      ['BE', 'Bélgica'],
      ['SE', 'Suecia'],
      ['NO', 'Noruega'],
      ['DK', 'Dinamarca'],
      ['FI', 'Finlandia'],
      ['CH', 'Suiza'],
      ['PT', 'Portugal'],
      ['AU', 'Australia'],
      ['NZ', 'Nueva Zelanda'],
      ['ZA', 'Sudáfrica'],
      ['NG', 'Nigeria'],
      ['KE', 'Kenia'],
      ['JP', 'Japón'],
      ['CN', 'China'],
      ['KR', 'Corea del Sur'],
      ['IN', 'India'],
      ['SG', 'Singapur'],
      ['AE', 'Emiratos Árabes Unidos'],
      ['SA', 'Arabia Saudita'],
      ['IL', 'Israel'],
    ]

    for (const [code, name] of countryUpdates) {
      await queryRunner.query(
        `UPDATE countries SET name = $2 WHERE code = $1`,
        [code, name],
      )
    }

    const provinceUpdates: Array<[string, string]> = [
      ['Bolivar', 'Bolívar'],
      ['Canar', 'Cañar'],
      ['Carchi', 'Carchi'],
      ['Chimborazo', 'Chimborazo'],
      ['Cotopaxi', 'Cotopaxi'],
      ['El Oro', 'El Oro'],
      ['Esmeraldas', 'Esmeraldas'],
      ['Galapagos', 'Galápagos'],
      ['Guayas', 'Guayas'],
      ['Imbabura', 'Imbabura'],
      ['Loja', 'Loja'],
      ['Los Rios', 'Los Ríos'],
      ['Manabi', 'Manabí'],
      ['Morona Santiago', 'Morona Santiago'],
      ['Napo', 'Napo'],
      ['Orellana', 'Orellana'],
      ['Pastaza', 'Pastaza'],
      ['Pichincha', 'Pichincha'],
      ['Santa Elena', 'Santa Elena'],
      ['Santo Domingo de los Tsachilas', 'Santo Domingo de los Tsáchilas'],
      ['Sucumbios', 'Sucumbíos'],
      ['Tungurahua', 'Tungurahua'],
      ['Zamora Chinchipe', 'Zamora Chinchipe'],
      ['Azuay', 'Azuay'],
    ]

    for (const [oldName, newName] of provinceUpdates) {
      await queryRunner.query(
        `UPDATE provinces SET name = $2 WHERE name = $1`,
        [oldName, newName],
      )
    }

    const cityUpdates: Array<[string, string]> = [
      ['Cuenca', 'Cuenca'],
      ['Gualaceo', 'Gualaceo'],
      ['Paute', 'Paute'],
      ['Chordeleg', 'Chordeleg'],
      ['Guaranda', 'Guaranda'],
      ['San Miguel', 'San Miguel'],
      ['Chillanes', 'Chillanes'],
      ['Azogues', 'Azogues'],
      ['Biblian', 'Biblián'],
      ['Canar', 'Cañar'],
      ['Tulcan', 'Tulcán'],
      ['Bolivar', 'Bolívar'],
      ['San Gabriel', 'San Gabriel'],
      ['Riobamba', 'Riobamba'],
      ['Guano', 'Guano'],
      ['Alausi', 'Alausí'],
      ['Latacunga', 'Latacunga'],
      ['Pujili', 'Pujilí'],
      ['Salcedo', 'Salcedo'],
      ['Machala', 'Machala'],
      ['Pasaje', 'Pasaje'],
      ['Santa Rosa', 'Santa Rosa'],
      ['Esmeraldas', 'Esmeraldas'],
      ['Atacames', 'Atacames'],
      ['Quininde', 'Quinindé'],
      ['Puerto Ayora', 'Puerto Ayora'],
      ['Puerto Baquerizo Moreno', 'Puerto Baquerizo Moreno'],
      ['Puerto Villamil', 'Puerto Villamil'],
      ['Guayaquil', 'Guayaquil'],
      ['Daule', 'Daule'],
      ['Samborondon', 'Samborondón'],
      ['Duran', 'Durán'],
      ['Ibarra', 'Ibarra'],
      ['Otavalo', 'Otavalo'],
      ['Cotacachi', 'Cotacachi'],
      ['Loja', 'Loja'],
      ['Catamayo', 'Catamayo'],
      ['Macara', 'Macará'],
      ['Babahoyo', 'Babahoyo'],
      ['Quevedo', 'Quevedo'],
      ['Ventanas', 'Ventanas'],
      ['Portoviejo', 'Portoviejo'],
      ['Manta', 'Manta'],
      ['Chone', 'Chone'],
      ['Macas', 'Macas'],
      ['Sucua', 'Sucúa'],
      ['Gualaquiza', 'Gualaquiza'],
      ['Tena', 'Tena'],
      ['Archidona', 'Archidona'],
      ['El Chaco', 'El Chaco'],
      ['Francisco de Orellana', 'Francisco de Orellana'],
      ['La Joya de los Sachas', 'La Joya de los Sachas'],
      ['Puyo', 'Puyo'],
      ['Mera', 'Mera'],
      ['Santa Clara', 'Santa Clara'],
      ['Quito', 'Quito'],
      ['Cayambe', 'Cayambe'],
      ['Ruminahui', 'Rumiñahui'],
      ['Santa Elena', 'Santa Elena'],
      ['La Libertad', 'La Libertad'],
      ['Salinas', 'Salinas'],
      ['Santo Domingo', 'Santo Domingo'],
      ['Nueva Loja', 'Nueva Loja'],
      ['Shushufindi', 'Shushufindi'],
      ['Cuyabeno', 'Cuyabeno'],
      ['Ambato', 'Ambato'],
      ['Banos', 'Baños'],
      ['Pelileo', 'Pelileo'],
      ['Zamora', 'Zamora'],
      ['Yantzaza', 'Yantzaza'],
      ['Zumba', 'Zumba'],
    ]

    for (const [oldName, newName] of cityUpdates) {
      await queryRunner.query(`UPDATE cities SET name = $2 WHERE name = $1`, [
        oldName,
        newName,
      ])
    }
  }

  public async down(): Promise<void> {
    // Intentionally left empty to preserve proper diacritics.
  }
}
