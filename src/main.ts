import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe, Logger } from '@nestjs/common'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const port = config.get<number>('PORT') || 3000
  const logger = new Logger('Bootstrap')

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
    config.get<string>('CORS_ORIGIN') || 'http://localhost:3000'
  const allowedOrigins = corsOrigins.split(',').map((origin) => origin.trim())

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origen (ej: Postman, mobile apps)
      if (!origin) {
        return callback(null, true)
      }

      // Verificar si el origen está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // Permitir cualquier dominio de Cloudflare Tunnel
      if (origin.includes('trycloudflare.com')) {
        return callback(null, true)
      }

      // Permitir localhost en desarrollo
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true)
      }

      // Rechazar otros orígenes
      callback(new Error('Not allowed by CORS'))
    },
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

  await app.listen(port)
  logger.log(
    `🚀 Application is running in ${config.get<string>('NODE_ENV')} mode on: http://localhost:${port}`,
  )
  logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  )
}

void bootstrap()
