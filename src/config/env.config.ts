import { registerAs } from '@nestjs/config'

export default registerAs('env', () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),

  // Database configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'cinemaec',
  DB_SSL: String(process.env.DB_SSL || '').toLowerCase() === 'true',
  DB_SYNCHRONIZE:
    String(process.env.DB_SYNCHRONIZE || '').toLowerCase() === 'true',
  DB_MIGRATIONS_RUN:
    String(process.env.DB_MIGRATIONS_RUN || '').toLowerCase() === 'true',

  // Firebase configuration
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Email configuration
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
  MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM || 'CinemaEC <noreply@cinemaec.com>',

  // Optional Email provider via HTTP API (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM: process.env.RESEND_FROM || process.env.MAIL_FROM,

  // Pool tuning
  DB_POOL_SIZE: Number(process.env.DB_POOL_SIZE || '0') || undefined,
  DB_CONNECTION_TIMEOUT_MS:
    Number(process.env.DB_CONNECTION_TIMEOUT_MS || '0') || undefined,

  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Frontend URL for email links
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
}))
