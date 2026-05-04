import { PartialType } from '@nestjs/mapped-types'
import { CreateProfessionalDto } from './create-professional.dto'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @IsString()
  @MaxLength(1000)
  extendedBiofilmography: string

  @IsOptional()
  @IsString()
  imdbProfile?: string | null
}
