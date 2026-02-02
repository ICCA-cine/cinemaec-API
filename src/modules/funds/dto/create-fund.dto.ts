import {
  IsString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  Length,
  Min,
} from 'class-validator'
import { FundType } from '../enums/fund-type.enum'
import { FinancialOrigin } from '../enums/financial-origin.enum'

export class CreateFundDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nombre: string

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(FundType, { each: true })
  tipo: FundType[]

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  countryId: number

  @IsEnum(FinancialOrigin)
  @IsNotEmpty()
  origenFinanciero: FinancialOrigin
}
