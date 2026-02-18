import { IsOptional, IsString, Length, MaxLength } from 'class-validator'

export class CreateProfessionalDto {
  @IsString()
  @Length(1, 255)
  name: string

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
}
