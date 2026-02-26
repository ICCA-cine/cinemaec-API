import { IsEnum } from 'class-validator'
import { MovieStatusEnum } from '../entities/movie.entity'

export class UpdateMovieStatusDto {
  @IsEnum(MovieStatusEnum)
  status: MovieStatusEnum
}
