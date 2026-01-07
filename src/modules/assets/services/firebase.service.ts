import { Injectable, Logger } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'
import { Multer } from 'multer'

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name)
  private storage: admin.storage.Storage
  private isConfigured = false
  private readonly environmentPrefix: string

  constructor(private configService: ConfigService) {
    // Determinar el prefijo según el entorno
    const nodeEnv = this.configService.get<string>('NODE_ENV')
    this.environmentPrefix = nodeEnv === 'production' ? 'assets' : 'test'
    // Inicializar Firebase Admin SDK
    if (!admin.apps.length) {
      try {
        const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID')
        const privateKey = this.configService.get<string>(
          'FIREBASE_PRIVATE_KEY',
        )
        const clientEmail = this.configService.get<string>(
          'FIREBASE_CLIENT_EMAIL',
        )
        const storageBucket = this.configService.get<string>(
          'FIREBASE_STORAGE_BUCKET',
        )

        // Validar que las credenciales no sean de ejemplo
        if (
          !projectId ||
          !privateKey ||
          !clientEmail ||
          !storageBucket ||
          clientEmail.includes('xxxxx') ||
          privateKey.includes('...')
        ) {
          this.logger.warn(
            '⚠️  Firebase no configurado - usando credenciales de ejemplo. ' +
              'Ver FIREBASE_CREDENTIALS_SETUP.md para configurar correctamente.',
          )
          return
        }

        const serviceAccount = {
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket,
        })

        this.storage = admin.storage()
        this.isConfigured = true
        this.logger.log('✅ Firebase Admin SDK inicializado correctamente')
      } catch (error) {
        this.logger.error(
          `❌ Error al inicializar Firebase: ${error.message}. ` +
            'Ver FIREBASE_CREDENTIALS_SETUP.md para más información.',
        )
      }
    } else {
      this.storage = admin.storage()
      this.isConfigured = true
    }
  }

  /**
   * Sube un archivo a Firebase Storage de forma ordenada
   */
  async uploadFile(
    file: Multer.File,
    path: string,
  ): Promise<{ url: string; fullPath: string }> {
    if (!this.isConfigured) {
      throw new Error(
        'Firebase no está configurado. Ver FIREBASE_CREDENTIALS_SETUP.md',
      )
    }

    try {
      const bucket = this.storage.bucket()
      // Agregar prefijo de entorno al path
      const fileName = `${this.environmentPrefix}/${path}/${Date.now()}_${file.originalname}`
      const fileUpload = bucket.file(fileName)

      await fileUpload.save(file.buffer as Buffer, {
        metadata: {
          contentType: file.mimetype,
        },
        public: true,
      })

      // Obtener URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

      this.logger.log(`✅ Archivo subido: ${fileName}`)

      return {
        url: publicUrl,
        fullPath: fileName,
      }
    } catch (error) {
      this.logger.error(`❌ Error al subir archivo: ${error.message}`)
      throw error
    }
  }

  /**
   * Elimina un archivo de Firebase Storage
   */
  async deleteFile(fullPath: string): Promise<void> {
    if (!this.isConfigured) {
      this.logger.warn(
        '⚠️  Firebase no configurado - saltando eliminación de archivo',
      )
      return
    }

    try {
      const bucket = this.storage.bucket()
      await bucket.file(fullPath).delete()
      this.logger.log(`✅ Archivo eliminado: ${fullPath}`)
    } catch (error) {
      this.logger.error(`❌ Error al eliminar archivo: ${error.message}`)
      throw error
    }
  }

  /**
   * Extrae el path completo de una URL de Firebase Storage
   */
  extractPathFromUrl(url: string): string {
    try {
      // Formato: https://storage.googleapis.com/{bucket}/{path}
      const urlParts = url.split('/')
      const bucketIndex = urlParts.findIndex((part) =>
        part.includes('storage.googleapis.com'),
      )
      return urlParts.slice(bucketIndex + 2).join('/')
    } catch (error) {
      this.logger.error(`❌ Error al extraer path de URL: ${error.message}`)
      return ''
    }
  }
}
