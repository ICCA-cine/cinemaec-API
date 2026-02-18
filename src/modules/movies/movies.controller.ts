import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { MoviesService } from './movies.service'
import { UpdateMovieCastCrewDto } from './dto/update-cast-crew.dto'
import { CreateMovieDto } from './dto/create-movie.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { ProfessionalsService } from '../professionals/professionals.service'
import { CurrentUser } from '../users/decorators/current-user.decorator'

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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una película' })
  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  create(
    @CurrentUser() user: { userId?: number; sub?: number },
    @Body() createMovieDto: CreateMovieDto,
  ) {
    const createdById = user.userId ?? user.sub
    return this.moviesService.create(createMovieDto, createdById)
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una película' })
  @ApiResponse({ status: 200, description: 'Película actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId?: number; sub?: number },
    @Body() updateMovieDto: CreateMovieDto,
  ) {
    const updatedById = user.userId ?? user.sub
    return this.moviesService.update(id, updateMovieDto, updatedById)
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

  @Put(':id/toggle-active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alternar estado activo de una película' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Película no encontrada',
  })
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.toggleActive(id)
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
