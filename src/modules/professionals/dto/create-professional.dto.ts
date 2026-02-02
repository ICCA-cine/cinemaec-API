import { IsString, IsEnum, IsEmail, IsOptional, Length } from 'class-validator'
import { Gender } from '../entities/professional.entity'

export class CreateProfessionalDto {
  @IsString()
  @Length(1, 100)
  nombres: string

  @IsString()
  @Length(1, 100)
  apellidos: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  cedula?: string

  @IsEnum(Gender)
  sexo: Gender

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string
}
