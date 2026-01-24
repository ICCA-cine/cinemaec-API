import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SpaceTypeEnum, SpaceStatusEnum } from '../entities/space.entity'

/**
 * Asset embebido en la respuesta de Space
 */
export class AssetResponseDto {
  @ApiProperty({ description: 'ID del asset' })
  id: number

  @ApiProperty({ description: 'URL del asset' })
  url: string

  @ApiProperty({ description: 'Tipo de documento' })
  documentType: string

  @ApiPropertyOptional({ description: 'Tipo de propietario' })
  ownerType?: string

  @ApiPropertyOptional({ description: 'Fecha de creación' })
  createdAt?: string
}

/**
 * Asset en documentos
 */
export class AssetDocumentDto {
  @ApiProperty({ description: 'ID del asset' })
  id: number

  @ApiProperty({ description: 'URL del asset' })
  url: string

  @ApiProperty({ description: 'Tipo de documento' })
  documentType: string

  @ApiPropertyOptional({ description: 'Fecha de creación' })
  createdAt?: string
}

/**
 * Documentos de un Space
 */
export class SpaceDocumentsResponseDto {
  @ApiPropertyOptional({ description: 'Documento CI' })
  ci?: AssetDocumentDto | null

  @ApiPropertyOptional({ description: 'Documento RUC' })
  ruc?: AssetDocumentDto | null

  @ApiPropertyOptional({ description: 'Documento del administrador' })
  manager?: AssetDocumentDto | null

  @ApiPropertyOptional({ description: 'Recibo de servicios' })
  serviceBill?: AssetDocumentDto | null

  @ApiPropertyOptional({ description: 'Licencia de operación' })
  operatingLicense?: AssetDocumentDto | null
}

/**
 * Assets embebidos de un Space
 */
export class SpaceAssetsResponseDto {
  @ApiPropertyOptional({ description: 'Logo del espacio' })
  logo?: AssetResponseDto | null

  @ApiProperty({ description: 'Fotos del espacio', type: [AssetResponseDto] })
  photos: AssetResponseDto[]

  @ApiProperty({ description: 'Documentos del espacio' })
  documents: SpaceDocumentsResponseDto
}

/**
 * Respuesta del Space (GET /spaces/:id o POST /spaces)
 */
export class SpaceResponseDto {
  @ApiProperty({ description: 'ID del espacio' })
  id: number

  @ApiProperty({ description: 'ID del usuario propietario' })
  userId: number

  // Información básica
  @ApiProperty({ description: 'Nombre del espacio', maxLength: 255 })
  name: string

  @ApiProperty({
    description: 'Tipo de espacio',
    enum: SpaceTypeEnum,
  })
  type: SpaceTypeEnum

  @ApiProperty({ description: 'Provincia', maxLength: 100 })
  province: string

  @ApiProperty({ description: 'Ciudad', maxLength: 100 })
  city: string

  @ApiProperty({ description: 'Dirección', maxLength: 255 })
  address: string

  @ApiProperty({ description: 'Email de contacto', maxLength: 255 })
  email: string

  @ApiProperty({ description: 'Teléfono de contacto', maxLength: 20 })
  phone: string

  @ApiPropertyOptional({ description: 'RUC', maxLength: 13 })
  ruc?: string | null

  @ApiProperty({ description: 'Coordenadas [latitud, longitud]', type: [Number] })
  coordinates: number[]

  @ApiProperty({ description: 'Descripción del espacio' })
  description: string

  @ApiProperty({ description: 'Público objetivo', type: [String] })
  target: string[]

  // Personal administrativo
  @ApiProperty({ description: 'Nombre del administrador', maxLength: 255 })
  managerName: string

  @ApiProperty({ description: 'Teléfono del administrador', maxLength: 20 })
  managerPhone: string

  @ApiProperty({ description: 'Email del administrador', maxLength: 255 })
  managerEmail: string

  // Personal técnico
  @ApiProperty({ description: 'Técnico encargado', maxLength: 255 })
  technicianInCharge: string

  @ApiProperty({ description: 'Cargo del técnico', maxLength: 100 })
  technicianRole: string

  @ApiProperty({ description: 'Teléfono del técnico', maxLength: 20 })
  technicianPhone: string

  @ApiProperty({ description: 'Email del técnico', maxLength: 255 })
  technicianEmail: string

  // Infraestructura
  @ApiProperty({ description: 'Capacidad de personas' })
  capacity: number

  @ApiProperty({ description: 'Equipamiento de proyección', type: [String] })
  projectionEquipment: string[]

  @ApiProperty({ description: 'Equipamiento de sonido', type: [String] })
  soundEquipment: string[]

  @ApiProperty({ description: 'Información de pantallas', type: [String] })
  screen: string[]

  // Servicios y operación
  @ApiProperty({ description: 'Registro de taquilla' })
  boxofficeRegistration: string

  @ApiProperty({ description: 'Accesibilidades', type: [String] })
  accessibilities: string[]

  @ApiProperty({ description: 'Servicios disponibles', type: [String] })
  services: string[]

  @ApiProperty({ description: 'Historial operacional' })
  operatingHistory: string

  @ApiProperty({ description: 'Actividad principal' })
  mainActivity: string

  @ApiProperty({ description: 'Otras actividades', type: [String] })
  otherActivities: string[]

  @ApiProperty({ description: 'Actividades comerciales', type: [String] })
  commercialActivities: string[]

  // Assets (IDs legacy por compatibilidad)
  @ApiProperty({ description: 'ID del logo' })
  logoId: number

  @ApiProperty({ description: 'IDs de fotos', type: [Number] })
  photosId: number[]

  @ApiProperty({ description: 'ID documento CI' })
  ciDocument: number

  @ApiPropertyOptional({ description: 'ID documento RUC' })
  rucDocument?: number | null

  @ApiProperty({ description: 'ID documento administrador' })
  managerDocument: number

  @ApiProperty({ description: 'ID recibo de servicios' })
  serviceBill: number

  @ApiProperty({ description: 'ID licencia de operación' })
  operatingLicense: number

  @ApiPropertyOptional({ description: 'ID del contrato' })
  contractId?: number | null

  // Assets embebidos
  @ApiPropertyOptional({ description: 'Assets embebidos' })
  assets?: SpaceAssetsResponseDto

  // Estado
  @ApiProperty({
    description: 'Estado del espacio',
    enum: SpaceStatusEnum,
  })
  status: SpaceStatusEnum

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: string

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: string
}

/**
 * Respuesta paginada de espacios
 */
export class SpacesListResponseDto {
  @ApiProperty({ description: 'Lista de espacios', type: [SpaceResponseDto] })
  data: SpaceResponseDto[]

  @ApiProperty({ description: 'Total de registros' })
  total: number

  @ApiProperty({ description: 'Página actual' })
  page: number

  @ApiProperty({ description: 'Límite de registros por página' })
  limit: number
}
