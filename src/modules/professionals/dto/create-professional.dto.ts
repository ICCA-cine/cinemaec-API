import { IsString, IsEnum, IsEmail, IsOptional, Length } from 'class-validator'
import { Gender } from '../entities/professional.entity'

export class CreateProfessionalDto {
  @IsString()
  @Length(1, 255)
  name: string

  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string

  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  cedula?: string

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
  @IsString()
  @Length(1, 255)
  sitioWeb?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  linkedin?: string

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender
}
