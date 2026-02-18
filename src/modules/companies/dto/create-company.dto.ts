import {
  IsString,
  IsOptional,
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
  representante?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  cedulaRepresentante?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  celular?: string

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

  @IsInt()
  countryId: number
}
