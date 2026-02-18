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
  @Length(1, 255)
  nombre: string

  @IsOptional()
  @IsString()
  @Length(1, 13)
  ruc?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  legalName?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  commercialName?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  representante?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  cedulaRepresentante?: string

  @IsInt()
  countryId: number

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  celular?: string

  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  website?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  sitioWeb?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  instagram?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  linkedin?: string
}
