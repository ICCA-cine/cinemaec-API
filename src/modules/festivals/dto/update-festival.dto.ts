import { PartialType } from '@nestjs/mapped-types'
import { CreateFestivalDto } from './create-festival.dto'

export class UpdateFestivalDto extends PartialType(CreateFestivalDto) {}
