import { IsInt } from 'class-validator'

export class CreateMovieClaimRequestDto {
  @IsInt()
  movieId: number

  @IsInt()
  supportDocumentAssetId: number
}
