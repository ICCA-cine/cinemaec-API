import { IsString, IsInt, IsNotEmpty, Length, Min } from 'class-validator'

export class CreateExhibitionSpaceDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  ruc: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nombre: string

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  countryId: number
}
