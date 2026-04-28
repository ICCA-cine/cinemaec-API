import { PartialType } from '@nestjs/mapped-types'
import { CreateProfessionalDto } from './create-professional.dto'

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
	@IsString()
	@MaxLength(1000)
	extendedBiofilmography: string
}
