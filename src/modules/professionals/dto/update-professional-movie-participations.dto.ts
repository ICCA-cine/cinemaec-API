import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ProfessionalMovieParticipationDto } from './create-professional.dto'

export class UpdateProfessionalMovieParticipationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionalMovieParticipationDto)
  movieParticipations: ProfessionalMovieParticipationDto[]
}
