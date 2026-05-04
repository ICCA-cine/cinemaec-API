import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  Matches,
  ValidateIf,
} from 'class-validator'
import { LegalStatus } from '../entities/profile.entity'

export class CreateProfileDto {
  @ApiProperty({
    description: 'Nombre completo (Nombre y Apellido)',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre completo debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @Matches(/^[A-Za-zÀ-ÿ\u00f1\u00d1]+(\s+[A-Za-zÀ-ÿ\u00f1\u00d1]+)+$/, {
    message: 'El nombre completo debe contener al menos nombre y apellido',
  })
  @MaxLength(255)
  fullName: string

  @ApiPropertyOptional({
    description: 'Razón social (requerida si es persona jurídica)',
    example: 'Empresa S.A.',
  })
  @ValidateIf((o) => o.legal_status === LegalStatus.LEGAL_ENTITY)
  @IsNotEmpty({
    message: 'La razón social es obligatoria para persona jurídica',
  })
  @IsString({ message: 'La razón social debe ser un texto' })
  @MaxLength(255)
  @IsOptional()
  legalName?: string

  @ApiPropertyOptional({
    description: 'Nombre comercial (requerido si es persona jurídica)',
    example: 'Mi Negocio',
  })
  @ValidateIf((o) => o.legal_status === LegalStatus.LEGAL_ENTITY)
  @IsNotEmpty({
    message: 'El nombre comercial es obligatorio para persona jurídica',
  })
  @IsString({ message: 'El nombre comercial debe ser un texto' })
  @MaxLength(255)
  @IsOptional()
  tradeName?: string

  @ApiPropertyOptional({
    description: 'Estado legal',
    enum: LegalStatus,
    example: LegalStatus.NATURAL_PERSON,
  })
  @IsEnum(LegalStatus, { message: 'Estado legal inválido' })
  legalStatus?: LegalStatus

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1990-01-15',
  })
  @IsDateString({}, { message: 'Fecha de nacimiento inválida' })
  @IsOptional()
  birthdate?: string

  @ApiPropertyOptional({
    description: 'Provincia (una sola palabra)',
    example: 'Pichincha',
  })
  @IsString({ message: 'La provincia debe ser un texto' })
  @MaxLength(100)
  @IsOptional()
  province?: string

  @ApiPropertyOptional({
    description: 'Ciudad (una sola palabra)',
    example: 'Quito',
  })
  @IsString({ message: 'La ciudad debe ser un texto' })
  @MaxLength(100)
  @IsOptional()
  city?: string

  @ApiPropertyOptional({
    description: 'Dirección',
    example: 'Av. Principal 123',
  })
  @IsString({ message: 'La dirección debe ser un texto' })
  @MaxLength(255)
  @IsOptional()
  address?: string

  @ApiPropertyOptional({
    description: 'Teléfono celular (formato: 09XXXXXXXX)',
    example: '0987654321',
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @ValidateIf(
    (o) => o.phone !== undefined && o.phone !== null && o.phone !== '',
  )
  @Matches(/^09\d{8}$/, {
    message:
      'El teléfono debe tener formato de celular ecuatoriano (09XXXXXXXX)',
  })
  phone?: string
}
