import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe, Logger } from '@nestjs/common'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { DataSource } from 'typeorm'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  // En Cloud Run, PORT es reservado. Usar 8080 en producción, 3000 en desarrollo
  const nodeEnv = config.get<string>('NODE_ENV') || 'development'
  const port =
    nodeEnv === 'production' ? 8080 : config.get<number>('PORT') || 3000
  const logger = new Logger('Bootstrap')

  // Ejecutar migraciones pendientes (siempre) para asegurar esquema actualizado
  try {
    const dataSource = app.get(DataSource)
    if (dataSource && !dataSource.isInitialized) {
      await dataSource.initialize()
    }

    if (dataSource) {
      logger.log('🔄 Ejecutando migraciones pendientes...')
      await dataSource.runMigrations()
      logger.log('✅ Migraciones ejecutadas exitosamente')
    }
  } catch (error) {
    logger.error('⚠️ Error ejecutando migraciones:', error)
    // No lanzamos error para no bloquear startup en caso de problemas
  }

  // Logging interceptor global
  app.useGlobalInterceptors(new LoggingInterceptor())

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS configuration - soporte para múltiples orígenes incluyendo Cloudflare Tunnel
  const corsOrigins =
    config.get<string>('CORS_ORIGIN') ||
    'https://app.cinemaec.com,http://localhost:3000'
  const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim())

  logger.log(`🔐 CORS Origins configurados: ${allowedOrigins.join(', ')}`)

  app.enableCors({
    origin: true, // Temporal: permitir todos los orígenes para diagnosticar
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CinemaEC API')
    .setDescription('Documentación de la API de CinemaEC')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(port, '0.0.0.0')
  logger.log(
    `🚀 Application is running in ${config.get<string>('NODE_ENV')} mode on: http://0.0.0.0:${port}`,
  )
  logger.log(
    `📚 Swagger documentation available at: http://0.0.0.0:${port}/api`,
  )
}

void bootstrap()
