import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ProfessionalsService } from './professionals.service'
import { CreateProfessionalDto } from './dto/create-professional.dto'
import { UpdateProfessionalDto } from './dto/update-professional.dto'
import { UpdateProfessionalMovieParticipationsDto } from './dto/update-professional-movie-participations.dto'
import {
  ProfessionalClaimCheckResponse,
  ProfessionalClaimResponse,
} from './dto/professional-claim-check.response'
import { ClaimProfessionalDto } from './dto/claim-professional.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CurrentUser, JwtPayload } from '../users/decorators/current-user.decorator'

@ApiTags('Professionals')
@Controller('professionals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get('claim/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Verificar si existe un perfil profesional con la cédula del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de verificación de perfil reclamable',
    type: ProfessionalClaimCheckResponse,
  })
  async checkClaim(
    @CurrentUser() user: JwtPayload,
  ): Promise<ProfessionalClaimCheckResponse> {
    return await this.professionalsService.checkClaimByCurrentUser(user.sub)
  }

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Reclamar el perfil profesional que coincide con la cédula del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil profesional reclamado exitosamente',
    type: ProfessionalClaimResponse,
  })
  async claimProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: ClaimProfessionalDto,
  ): Promise<ProfessionalClaimResponse> {
    return await this.professionalsService.claimByCurrentUser(
      user.sub,
      body?.professionalId,
    )
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo profesional' })
  @ApiResponse({
    status: 201,
    description: 'Profesional creado exitosamente',
  })
  async create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return await this.professionalsService.create(createProfessionalDto)
  }

  @Post('claim/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo perfil profesional para el usuario autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil profesional registrado y asociado al usuario',
  })
  async registerProfile(
    @Body() createProfessionalDto: CreateProfessionalDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.professionalsService.registerForCurrentUser(
      createProfessionalDto,
      user.sub,
    )
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los profesionales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de profesionales',
  })
  async findAll() {
    return await this.professionalsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un profesional por ID' })
  @ApiResponse({
    status: 200,
    description: 'Profesional encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesional no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.professionalsService.findOne(id)
  }

  @Get(':id/movie-participations')
  @ApiOperation({
    summary: 'Listar participaciones en peliculas del profesional',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de participaciones en peliculas',
  })
  async getMovieParticipations(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.professionalsService.getMovieParticipations(id, user.sub)
  }

  @Put(':id/movie-participations')
  @ApiOperation({
    summary: 'Actualizar participaciones en peliculas del profesional',
  })
  @ApiResponse({
    status: 200,
    description: 'Participaciones en peliculas actualizadas',
  })
  async updateMovieParticipations(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateProfessionalMovieParticipationsDto,
  ) {
    await this.professionalsService.updateMovieParticipations(
      id,
      user.sub,
      body.movieParticipations,
    )
    return { message: 'Participaciones actualizadas' }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un profesional' })
  @ApiResponse({
    status: 200,
    description: 'Profesional actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesional no encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    return await this.professionalsService.update(id, updateProfessionalDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un profesional' })
  @ApiResponse({
    status: 204,
    description: 'Profesional eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesional no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.professionalsService.remove(id)
  }
}
