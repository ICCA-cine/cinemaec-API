import {
  IsString,
  IsEnum,
  IsEmail,
  IsOptional,
  IsInt,
  IsArray,
  IsNumber,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SpaceTypeEnum, SpaceStatusEnum } from '../entities/space.entity'

export class CreateSpaceDto {
  @ApiProperty({
    description: 'Nombre del espacio',
    example: 'Teatro Nacional Sucre',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string

  @ApiProperty({
    description: 'Tipo de espacio',
    enum: SpaceTypeEnum,
    example: SpaceTypeEnum.THEATER,
  })
  @IsEnum(SpaceTypeEnum)
  type: SpaceTypeEnum

  @ApiProperty({
    description: 'Provincia donde se ubica el espacio',
    example: 'Pichincha',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  province: string

  @ApiProperty({
    description: 'Ciudad donde se ubica el espacio',
    example: 'Quito',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  city: string

  @ApiProperty({
    description: 'Dirección completa del espacio',
    example: 'Calle Venezuela N8-54 y Chile',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  address: string

  @ApiProperty({
    description: 'Email de contacto del espacio',
    example: 'contacto@teatronacional.gob.ec',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email: string

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '022951661',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  phone: string

  @ApiProperty({
    description: 'Coordenadas geográficas [latitud, longitud]',
    example: [-0.2182, -78.5126],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: number[]

  @ApiProperty({
    description: 'Descripción detallada del espacio',
    example:
      'El Teatro Nacional Sucre es el principal teatro de ópera de Ecuador...',
  })
  @IsString()
  description: string

  @ApiProperty({
    description: 'Público objetivo del espacio',
    example: ['Público general', 'Estudiantes', 'Familias'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  target: string[]

  @ApiProperty({
    description: 'Nombre del administrador',
    example: 'María González',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  managerName: string

  @ApiProperty({
    description: 'Teléfono del administrador',
    example: '0987654321',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  managerPhone: string

  @ApiProperty({
    description: 'Email del administrador',
    example: 'admin@teatronacional.gob.ec',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  managerEmail: string

  @ApiProperty({
    description: 'Nombre del técnico encargado de la proyección',
    example: 'Carlos Mendoza',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  technicianInCharge: string

  @ApiProperty({
    description: 'Cargo del técnico encargado de la sala',
    example: 'Técnico de Proyección',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  technicianRole: string

  @ApiProperty({
    description: 'Teléfono del técnico encargado',
    example: '0991234567',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  technicianPhone: string

  @ApiProperty({
    description: 'Email del técnico encargado',
    example: 'tecnico@teatronacional.gob.ec',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  technicianEmail: string

  @ApiProperty({
    description: 'Capacidad total de personas',
    example: 850,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number

  @ApiProperty({
    description: 'Equipamiento de proyección disponible',
    example: ['Proyector 4K', 'Pantalla 20x10m', 'Sistema DCP'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  projectionEquipment: string[]

  @ApiProperty({
    description: 'Equipamiento de sonido disponible',
    example: ['Dolby Atmos', 'Sistema 7.1', 'Micrófonos inalámbricos'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  soundEquipment: string[]

  @ApiProperty({
    description: 'Información sobre pantallas',
    example: ['Pantalla principal 20x10m', 'Pantalla auxiliar 5x3m'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  screen: string[]

  @ApiProperty({
    description: 'Descripción del método de registro de taquilla',
    example: 'Sistema digital con software de venta de entradas',
  })
  @IsString()
  boxofficeRegistration: string

  @ApiProperty({
    description: 'Servicios de accesibilidad disponibles',
    example: ['Rampa de acceso', 'Baños adaptados', 'Señalización braille'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  accessibilities: string[]

  @ApiProperty({
    description: 'Servicios adicionales disponibles',
    example: ['wifi', 'cafetería', 'estacionamiento'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  services: string[]

  @ApiProperty({
    description:
      'Descripción de las actividades operativas de los últimos años',
    example: 'Durante los últimos 3 años se han realizado 150 proyecciones...',
  })
  @IsString()
  operatingHistory: string

  @ApiProperty({
    description: 'Actividad principal del espacio',
    example: 'Proyección de películas y eventos culturales',
  })
  @IsString()
  mainActivity: string

  @ApiProperty({
    description: 'Otras actividades que realiza el espacio',
    example: ['Teatro', 'Conciertos', 'Conferencias'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  otherActivities: string[]

  @ApiProperty({
    description: 'Actividades comerciales del espacio',
    example: ['Venta de entradas', 'Cafetería', 'Alquiler de equipos'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  commercialActivities: string[]

  @ApiProperty({
    description: 'ID del asset que representa el logo del espacio',
    example: 15,
  })
  @IsInt()
  logoId: number

  @ApiProperty({
    description: 'Array de IDs de assets que representan fotos del espacio',
    example: [16, 17, 18],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  photosId: number[]

  @ApiProperty({
    description:
      'ID del documento de cédula de identidad en formato PDF (asset)',
    example: 20,
  })
  @IsInt()
  ciDocument: number

  @ApiPropertyOptional({
    description: 'ID del documento RUC (asset) - Opcional',
    example: 21,
  })
  @IsOptional()
  @IsInt()
  rucDocument?: number

  @ApiProperty({
    description:
      'ID del documento que acredita al administrador en formato PDF (asset)',
    example: 22,
  })
  @IsInt()
  managerDocument: number

  @ApiProperty({
    description: 'ID de la planilla de servicio básico en formato PDF (asset)',
    example: 23,
  })
  @IsInt()
  serviceBill: number

  @ApiProperty({
    description:
      'ID del documento de licencia de funcionamiento en formato PDF (asset)',
    example: 24,
  })
  @IsInt()
  operatingLicense: number

  @ApiPropertyOptional({
    description: 'ID del contrato asociado',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  contractId?: number

  @ApiPropertyOptional({
    description: 'Estado del espacio',
    enum: SpaceStatusEnum,
    example: SpaceStatusEnum.PENDING,
    default: SpaceStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(SpaceStatusEnum)
  status?: SpaceStatusEnum
}
