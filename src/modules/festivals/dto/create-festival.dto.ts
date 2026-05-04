import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'

class FestivalSectionDto {
  @IsString()
  @MaxLength(255)
  name: string

  @IsBoolean()
  competitive: boolean
}

export class CreateFestivalDto {
  @IsString()
  @MaxLength(255)
  name: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  editionCount: number

  @Type(() => Number)
  @IsInt()
  firstEditionYear: number

  @IsString()
  @MaxLength(100)
  type: string

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  hostCities: number[]

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  modality: string[]

  @Type(() => Number)
  @IsInt()
  mainVenue: number

  @IsOptional()
  @IsUrl({}, { message: 'website must be a valid URL' })
  @MaxLength(255)
  website?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  theme: string

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  producerCompanyIds?: number[]

  @IsString()
  @MaxLength(300)
  description: string

  @IsOptional()
  @IsString()
  @MaxLength(300)
  descriptionEn?: string

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  directors?: number[]

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  producerIds?: number[]

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  programmers?: number[]

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  classification: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  contactName: string

  @IsEmail()
  @MaxLength(255)
  contactEmail: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  contactPhone: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  posterId?: number

  @IsOptional()
  @IsUrl({}, { message: 'trailer must be a valid URL' })
  @MaxLength(500)
  trailer?: string

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  stillsIds?: number[]

  @IsOptional()
  @IsString()
  @MaxLength(300)
  needs?: string

  @IsOptional()
  @IsString()
  @MaxLength(300)
  needsEn?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dossierEsId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dossierEnId?: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FestivalSectionDto)
  sections?: FestivalSectionDto[]

  @IsOptional()
  @IsBoolean()
  hasCall?: boolean

  @IsOptional()
  @IsString()
  callProcess?: string

  @IsOptional()
  @IsUrl({}, { message: 'callLink must be a valid URL' })
  @MaxLength(500)
  callLink?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
