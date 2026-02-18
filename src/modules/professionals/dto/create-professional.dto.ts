import { IsString, IsOptional, Length } from 'class-validator'

export class CreateProfessionalDto {
  @IsString()
  @Length(1, 255)
  name: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  cedula?: string

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
  linkedin?: string
}
