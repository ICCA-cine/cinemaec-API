import {
  IsString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
} from 'class-validator'
import { PlatformType } from '../enums/platform-type.enum'

export class CreatePlatformDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string

  @IsEnum(PlatformType)
  @IsNotEmpty()
  type: PlatformType

  @IsInt()
  @IsOptional()
  @Min(1)
  logoId?: number
}
