import 'express'
import { Multer } from 'multer'

declare global {
  namespace Express {
    interface Multer {
      File: Multer.File
    }
  }
}
