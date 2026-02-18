import {
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  @Length(1, 255)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(13)
  ruc?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  representative?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  representativeDniNumber?: string

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
  instagram?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  linkedin?: string
}
