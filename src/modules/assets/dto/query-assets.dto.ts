import { IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AssetTypeEnum, AssetOwnerEnum } from '../entities/asset.entity'

export class QueryAssetsDto {
  @ApiProperty({
    description: 'Filtrar por tipo de documento',
    enum: AssetTypeEnum,
    required: false,
  })
  @IsEnum(AssetTypeEnum)
  @IsOptional()
  documentType?: AssetTypeEnum

  @ApiProperty({
    description: 'Filtrar por tipo de propietario',
    enum: AssetOwnerEnum,
    required: false,
  })
  @IsEnum(AssetOwnerEnum)
  @IsOptional()
  ownerType?: AssetOwnerEnum

  @ApiProperty({
    description: 'Filtrar por ID de propietario',
    required: false,
  })
  @IsOptional()
  ownerId?: number
}
