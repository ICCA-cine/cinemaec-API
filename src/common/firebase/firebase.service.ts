import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.firestore.Firestore
  private auth: admin.auth.Auth

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Firebase Admin SDK ya está inicializado en algún lugar del proyecto
    // Obtener la instancia ya inicializada
    try {
      this.db = admin.firestore()
      this.auth = admin.auth()
    } catch (error) {
      console.error('❌ Failed to initialize Firebase service:', error)
    }
  }

  /**
   * Obtener referencia a Firestore
   */
  getFirestore(): admin.firestore.Firestore {
    return this.db
  }

  /**
   * Obtener referencia a Auth
   */
  getAuth(): admin.auth.Auth {
    return this.auth
  }

  /**
   * Guardar documento en Firestore
   */
  async saveDocument(
    collection: string,
    docId: string,
    data: Record<string, any>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).set(data, { merge: true })
  }

  /**
   * Obtener documento de Firestore
   */
  async getDocument(collection: string, docId: string): Promise<any> {
    const doc = await this.db.collection(collection).doc(docId).get()
    return doc.exists ? doc.data() : null
  }

  /**
   * Actualizar documento en Firestore
   */
  async updateDocument(
    collection: string,
    docId: string,
    data: Record<string, any>,
  ): Promise<void> {
    await this.db.collection(collection).doc(docId).update(data)
  }

  /**
   * Eliminar documento de Firestore
   */
  async deleteDocument(collection: string, docId: string): Promise<void> {
    await this.db.collection(collection).doc(docId).delete()
  }

  /**
   * Obtener colección
   */
  async getCollection(collection: string, limit: number = 100): Promise<any[]> {
    const snapshot = await this.db.collection(collection).limit(limit).get()
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  }

  /**
   * Verificar token de Firebase
   */
  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return await this.auth.verifyIdToken(token)
  }

  /**
   * Crear usuario en Firebase Auth
   */
  async createUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return await this.auth.createUser({
      email,
      password,
    })
  }
}
