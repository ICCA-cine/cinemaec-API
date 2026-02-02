import { PartialType } from '@nestjs/mapped-types'
import { CreateExhibitionSpaceDto } from './create-exhibition-space.dto'

export class UpdateExhibitionSpaceDto extends PartialType(
  CreateExhibitionSpaceDto,
) {}
