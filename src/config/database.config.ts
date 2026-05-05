import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('env.NODE_ENV')
  const dbSsl = configService.get<boolean>('env.DB_SSL')
  const dbSynchronize = configService.get<boolean>('env.DB_SYNCHRONIZE')
  const dbMigrationsRun = configService.get<boolean>('env.DB_MIGRATIONS_RUN')
  const poolSize = Number(configService.get<string>('env.DB_POOL_SIZE')) || 5
  const connectionTimeoutMillis =
    Number(configService.get<string>('env.DB_CONNECTION_TIMEOUT_MS')) || 30000

  return {
    type: 'postgres',
    host: configService.get<string>('env.DB_HOST'),
    port: configService.get<number>('env.DB_PORT'),
    username: configService.get<string>('env.DB_USERNAME'),
    password: configService.get<string>('env.DB_PASSWORD'),
    database: configService.get<string>('env.DB_NAME'),
    ssl: dbSsl ? { rejectUnauthorized: false } : undefined,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: dbSynchronize ?? false,
    logging: nodeEnv === 'development',
    migrationsRun: dbMigrationsRun ?? nodeEnv === 'production',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    extra: {
      max: poolSize,
      connectionTimeoutMillis,
    },
  }
}
