import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { CreateAdminCatalogDto } from './create-admin-catalog.dto'

export class UpdateAdminCatalogDto extends PartialType(CreateAdminCatalogDto) {
  @ApiPropertyOptional({ description: 'Estado activo del catálogo', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
