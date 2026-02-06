import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  GenreType,
  MovieClassification,
  MovieType,
  ProjectStatus,
} from '../entities/movie.entity'
import { MovieFundingStage } from '../enums/movie-funding-stage.enum'
import { MovieReleaseType } from '../enums/movie-release-type.enum'
import { FestivalNominationResult } from '../enums/festival-nomination-result.enum'
import { ContactRole } from '../entities/movie-contact.entity'
import { ExhibitionWindow } from '../enums/exhibition-window.enum'

export class CreateMovieDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  titleEn?: string

  @IsInt()
  @Min(1)
  durationMinutes: number

  @IsEnum(MovieType)
  type: MovieType

  @IsEnum(GenreType)
  genre: GenreType

  @IsInt()
  releaseYear: number

  @IsInt()
  countryId: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  subGenreIds?: number[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  subtitleLanguageIds?: number[]

  @IsString()
  synopsis: string

  @IsOptional()
  @IsString()
  synopsisEn?: string

  @IsOptional()
  @IsString()
  logLine?: string

  @IsOptional()
  @IsString()
  logLineEn?: string

  @IsEnum(MovieClassification)
  classification: MovieClassification

  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus

  @IsOptional()
  @IsString()
  projectNeed?: string

  @IsOptional()
  @IsString()
  projectNeedEn?: string

  @IsOptional()
  @IsInt()
  producerCompanyId?: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  coProducerCompanyIds?: number[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInternationalCoproductionDto)
  internationalCoproductions?: CreateInternationalCoproductionDto[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  directors?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  producers?: number[]

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  mainActors?: number[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieCrewDto)
  crew?: CreateMovieCrewDto[]

  @IsOptional()
  @IsInt()
  crewTotal?: number

  @IsOptional()
  @IsInt()
  actorsTotal?: number

  @IsOptional()
  @IsInt()
  totalBudget?: number

  @IsOptional()
  @IsInt()
  economicRecovery?: number

  @IsOptional()
  @IsInt()
  totalAudience?: number

  @IsOptional()
  @IsInt()
  posterAssetId?: number

  @IsOptional()
  @IsInt()
  dossierAssetId?: number

  @IsOptional()
  @IsInt()
  dossierEnAssetId?: number

  @IsOptional()
  @IsInt()
  pedagogicalGuideAssetId?: number

  @IsOptional()
  @IsString()
  trailerLink?: string

  @IsOptional()
  @IsString()
  makingOfLink?: string

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  stillAssetIds?: number[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieFundingDto)
  funding?: CreateMovieFundingDto[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filmingCitiesEc?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filmingCountries?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieNationalReleaseDto)
  nationalReleases?: CreateMovieNationalReleaseDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieInternationalReleaseDto)
  internationalReleases?: CreateMovieInternationalReleaseDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieFestivalNominationDto)
  festivalNominations?: CreateMovieFestivalNominationDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMoviePlatformDto)
  platforms?: CreateMoviePlatformDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieContactDto)
  contacts?: CreateMovieContactDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovieContentBankDto)
  contentBank?: CreateMovieContentBankDto[]
}

export class CreateInternationalCoproductionDto {
  @IsString()
  companyName: string

  @IsInt()
  countryId: number
}

export class CreateMovieCrewDto {
  @IsInt()
  cinematicRoleId: number

  @IsInt()
  professionalId: number
}

export class CreateMovieFundingDto {
  @IsInt()
  fundId: number

  @IsInt()
  year: number

  @IsOptional()
  @IsInt()
  amountGranted?: number

  @IsEnum(MovieFundingStage)
  fundingStage: MovieFundingStage
}

export class CreateMovieNationalReleaseDto {
  @IsInt()
  exhibitionSpaceId: number

  @IsInt()
  cityId: number

  @IsInt()
  year: number

  @IsEnum(MovieReleaseType)
  type: MovieReleaseType
}

export class CreateMovieInternationalReleaseDto {
  @IsOptional()
  @IsString()
  spaceName?: string

  @IsInt()
  countryId: number

  @IsInt()
  year: number

  @IsEnum(MovieReleaseType)
  type: MovieReleaseType
}

export class CreateMovieFestivalNominationDto {
  @IsInt()
  fundId: number

  @IsInt()
  year: number

  @IsString()
  category: string

  @IsEnum(FestivalNominationResult)
  result: FestivalNominationResult
}

export class CreateMoviePlatformDto {
  @IsInt()
  platformId: number

  @IsOptional()
  @IsString()
  link?: string
}

export class CreateMovieContactDto {
  @IsString()
  name: string

  @IsEnum(ContactRole)
  role: ContactRole

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  email?: string
}

export class CreateMovieContentBankDto {
  @IsEnum(ExhibitionWindow)
  exhibitionWindow: ExhibitionWindow

  @IsString()
  licensingStartDate: string

  @IsString()
  licensingEndDate: string

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  geolocationRestrictionCountryIds?: number[]
}
