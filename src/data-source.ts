import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
const envFile = `.env.${process.env.NODE_ENV || 'development'}`
dotenv.config({ path: resolve(__dirname, '..', envFile) })
dotenv.config({ path: resolve(__dirname, '..', '.env') })

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
})
