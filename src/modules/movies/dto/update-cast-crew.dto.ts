import { IsOptional, IsInt } from 'class-validator'

export class AddProfessionalToMovieDto {
  @IsInt()
  professionalId: number

  @IsInt()
  cinematicRoleId: number
}

export class UpdateMovieCastCrewDto {
  @IsOptional()
  directors?: number[]

  @IsOptional()
  producers?: number[]
}
