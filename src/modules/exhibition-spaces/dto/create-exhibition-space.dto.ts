import { IsString, IsInt, IsNotEmpty, Length, Min } from 'class-validator'

export class CreateExhibitionSpaceDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  countryId: number
}
