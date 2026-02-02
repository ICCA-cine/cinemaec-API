import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { MoviesService } from './movies.service'
import { UpdateMovieCastCrewDto } from './dto/update-cast-crew.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { ProfessionalsService } from '../professionals/professionals.service'

@ApiTags('Movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly professionalsService: ProfessionalsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las películas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de películas',
  })
  findAll() {
    return this.moviesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener película por ID' })
  @ApiResponse({
    status: 200,
    description: 'Película encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id)
  }

  @Put(':id/cast-crew')
  @ApiOperation({
    summary: 'Actualizar cast y crew de una película',
  })
  @ApiResponse({
    status: 200,
    description: 'Cast y crew actualizados exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  updateCastCrew(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCastCrewDto: UpdateMovieCastCrewDto,
  ) {
    return this.moviesService.updateCastCrew(id, updateCastCrewDto)
  }

  @Get('professionals/list')
  @ApiOperation({
    summary: 'Listar todos los profesionales disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de profesionales',
  })
  getProfessionals() {
    return this.professionalsService.findAll()
  }
}
