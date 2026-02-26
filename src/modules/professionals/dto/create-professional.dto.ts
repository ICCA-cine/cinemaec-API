import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ProfessionalMovieParticipationDto {
  @IsInt()
  movieId: number

  @IsInt()
  cinematicRoleId: number
}

export class CreateProfessionalDto {
  @IsString()
  @Length(1, 255)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nickName?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dniNumber?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  mobile?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkedin?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  rrss?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsString()
  bioEn?: string

  @IsOptional()
  @IsInt()
  profilePhotoAssetId?: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reelLink?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyNameCEO?: string

  @IsOptional()
  @IsInt()
  primaryActivityRoleId1?: number

  @IsOptional()
  @IsInt()
  primaryActivityRoleId2?: number

  @IsOptional()
  @IsInt()
  secondaryActivityRoleId1?: number

  @IsOptional()
  @IsInt()
  secondaryActivityRoleId2?: number

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsInt({ each: true })
  portfolioImageAssetIds?: number[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionalMovieParticipationDto)
  movieParticipations?: ProfessionalMovieParticipationDto[]
}
