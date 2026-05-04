import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProfessionalsService } from './professionals.service'

@ApiTags('Public Professionals')
@Controller('public/professionals')
export class PublicProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar perfiles profesionales públicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfiles profesionales marcados como públicos',
  })
  async findAll() {
    return await this.professionalsService.findPublic()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el perfil público de un profesional' })
  @ApiResponse({
    status: 200,
    description: 'Perfil público del profesional',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesional público no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.professionalsService.findPublicOne(id)
  }
}
