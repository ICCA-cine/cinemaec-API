import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { MovieClaimRequestStatus } from '../entities/movie-claim-request.entity'

export class UpdateMovieClaimRequestStatusDto {
  @IsEnum(MovieClaimRequestStatus)
  status: MovieClaimRequestStatus.APPROVED | MovieClaimRequestStatus.REJECTED

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observation?: string
}
