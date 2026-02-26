import {
  Controller,
  Get,
  Patch,
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
import { CreateMovieClaimRequestDto } from './dto/create-movie-claim-request.dto'
import { UpdateMovieClaimRequestStatusDto } from './dto/update-movie-claim-request-status.dto'
import { UpdateMovieStatusDto } from './dto/update-movie-status.dto'
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

  @Post('claim-requests')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear solicitud de reclamo de película' })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de reclamo creada exitosamente',
  })
  createClaimRequest(
    @CurrentUser() user: { userId?: number; sub?: number },
    @Body() createMovieClaimRequestDto: CreateMovieClaimRequestDto,
  ) {
    const claimantUserId = user.userId ?? user.sub
    return this.moviesService.createClaimRequest(
      createMovieClaimRequestDto.movieId,
      claimantUserId,
      createMovieClaimRequestDto.supportDocumentAssetId,
    )
  }

  @Get('claim-requests/mine')
  @ApiOperation({ summary: 'Listar mis solicitudes de reclamo de película' })
  @ApiResponse({
    status: 200,
    description: 'Solicitudes de reclamo del usuario listadas exitosamente',
  })
  findMyClaimRequests(
    @CurrentUser() user: { userId?: number; sub?: number },
  ) {
    const userId = user.userId ?? user.sub
    return this.moviesService.findClaimRequestsForUser(userId)
  }

  @Get('claim-requests/admin')
  @ApiOperation({
    summary:
      'Listar solicitudes de reclamo para administradores con permiso admin_movies',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitudes de reclamo listadas exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado para consultar solicitudes de reclamo',
  })
  findClaimRequestsForAdmin(
    @CurrentUser() user: { userId?: number; sub?: number },
  ) {
    const adminUserId = user.userId ?? user.sub
    return this.moviesService.findClaimRequestsForAdmin(adminUserId)
  }

  @Patch('claim-requests/:id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Aprobar o rechazar una solicitud de reclamo de película con observación',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud revisada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado para revisar solicitudes de reclamo',
  })
  @ApiResponse({
    status: 400,
    description: 'La solicitud no está en estado pendiente o datos inválidos',
  })
  reviewClaimRequest(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId?: number; sub?: number },
    @Body() updateMovieClaimRequestStatusDto: UpdateMovieClaimRequestStatusDto,
  ) {
    const adminUserId = user.userId ?? user.sub
    return this.moviesService.reviewClaimRequest(
      id,
      updateMovieClaimRequestStatusDto.status,
      adminUserId,
      updateMovieClaimRequestStatusDto.observation,
    )
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar estado enum de una película' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para actualizar estado' })
  @ApiResponse({ status: 404, description: 'Película no encontrada' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { userId?: number; sub?: number },
    @Body() updateMovieStatusDto: UpdateMovieStatusDto,
  ) {
    const requesterId = user.userId ?? user.sub
    return this.moviesService.updateStatus(
      id,
      updateMovieStatusDto.status,
      requesterId,
    )
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
