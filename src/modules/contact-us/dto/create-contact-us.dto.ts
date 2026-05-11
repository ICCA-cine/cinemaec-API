import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateContactUsDto {
  @ApiProperty({ example: 'Mariana Perez' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  name: string

  @ApiPropertyOptional({ example: 'Fundacion Cine Andino' })
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'La institución no puede exceder 255 caracteres',
  })
  institution?: string

  @ApiProperty({ example: 'mariana@example.com' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  email: string

  @ApiPropertyOptional({ example: '+593 99 123 4567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9()\-\s]{7,30}$/, {
    message: 'El número debe ser válido e incluir solo dígitos y símbolos comunes',
  })
  phone?: string

  @ApiProperty({ example: 'Quisiera recibir más información sobre su catálogo.' })
  @IsString()
  @MinLength(5, { message: 'El mensaje debe tener al menos 5 caracteres' })
  @MaxLength(300, { message: 'El mensaje no puede exceder 300 caracteres' })
  message: string
}