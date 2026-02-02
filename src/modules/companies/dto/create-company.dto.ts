import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsInt,
  Length,
} from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  @Length(1, 20)
  ruc: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nombreLegal?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nombreComercial?: string

  @IsInt()
  countryId: number

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string

  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  website?: string
}
