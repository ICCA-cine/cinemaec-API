import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateAdminCatalogDto {
  @ApiProperty({
    description: 'Nombre del catalogo',
    example: 'Catalogo Cine Ecuatoriano',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string

  @ApiProperty({
    description: 'Anio del catalogo',
    example: 2026,
  })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number

  @ApiProperty({
    description: 'ID del asset de imagen del catalogo',
    example: 123,
  })
  @IsInt()
  @Min(1)
  imageId: number

  @ApiPropertyOptional({
    description: 'Descripcion opcional del catalogo',
    example: 'Seleccion curada de producciones ecuatorianas.',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'IDs de películas a asociar al catálogo',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  movieIds?: number[]

  @ApiPropertyOptional({
    description: 'IDs de festivales a asociar al catálogo',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  festivalIds?: number[]

  @ApiPropertyOptional({
    description: 'IDs de profesionales a asociar al catálogo',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  professionalIds?: number[]
}
