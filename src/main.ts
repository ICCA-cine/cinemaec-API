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
  const nodeEnv = config.get<string>('NODE_ENV') || 'development'

  // Cloud Run provides PORT env var (default 8080). Always use that if provided.
  // Fallback to PORT or APP_PORT if not in Cloud Run
  const port =
    config.get<number>('PORT') ||
    config.get<number>('APP_PORT') ||
    (nodeEnv === 'production' ? 8080 : 3000)

  const logger = new Logger('Bootstrap')

  logger.log(`Starting application in ${nodeEnv} mode on port ${port}...`)

  const runMigrations = async () => {
    try {
      const dataSource = app.get(DataSource)
      if (dataSource && !dataSource.isInitialized) {
        logger.log('🔄 Initializing database connection...')
        await dataSource.initialize()
        logger.log('✅ Database connection established')
      }

      if (dataSource && dataSource.isInitialized) {
        logger.log('🔄 Running pending migrations...')
        await dataSource.runMigrations()
        logger.log('✅ Migrations executed successfully')
      }
    } catch (error) {
      logger.error('⚠️ Error during migrations:', error)
      logger.error('Stack trace:', error.stack)

      if (nodeEnv === 'production') {
        logger.error('💥 Migrations failed in production (continuing startup)')
      } else {
        logger.warn('⚠️ Continuing in development mode despite migration error')
      }
    }
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
    origin: true, // Permitir todos los orígenes - producción debe usar allowedOrigins específicos
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

  // En producción: iniciar servidor PRIMERO, luego ejecutar migraciones en background
  // En desarrollo: ejecutar migraciones antes de iniciar servidor
  if (nodeEnv === 'production') {
    await app.listen(port, '0.0.0.0')
    logger.log(
      `✅ Application is running in ${nodeEnv} mode on: http://0.0.0.0:${port}`,
    )
    logger.log(
      `📚 Swagger documentation available at: http://0.0.0.0:${port}/api`,
    )
    logger.log('🎯 Application is ready to accept requests')
    logger.log('🔄 Starting migrations in background...')
    void runMigrations()
  } else {
    await runMigrations()
    await app.listen(port, '0.0.0.0')
    logger.log(
      `✅ Application is running in ${nodeEnv} mode on: http://0.0.0.0:${port}`,
    )
    logger.log(
      `📚 Swagger documentation available at: http://0.0.0.0:${port}/api`,
    )
    logger.log('🎯 Application is ready to accept requests')
  }
}

void bootstrap()
