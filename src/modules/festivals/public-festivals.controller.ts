import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FestivalsService } from './festivals.service'

@ApiTags('Public Festivals')
@Controller('public/festivals')
export class PublicFestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle público de festival por ID' })
  @ApiResponse({ status: 200, description: 'Festival público encontrado' })
  @ApiResponse({ status: 404, description: 'Festival público no encontrado' })
  findPublicOne(@Param('id', ParseIntPipe) id: number) {
    return this.festivalsService.findPublicOne(id)
  }
}
