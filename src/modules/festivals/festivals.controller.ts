import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { FestivalsService } from './festivals.service'
import { CreateFestivalDto } from './dto/create-festival.dto'
import { UpdateFestivalDto } from './dto/update-festival.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import {
  CurrentUser,
  JwtPayload,
} from '../users/decorators/current-user.decorator'

@ApiTags('Festivals')
@Controller('festivals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FestivalsController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un festival, muestra o proyecto' })
  @ApiResponse({ status: 201, description: 'Festival creado exitosamente' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createFestivalDto: CreateFestivalDto,
  ) {
    const createdById = user.userId ?? user.sub
    return this.festivalsService.create(createFestivalDto, createdById)
  }

  @Get()
  @ApiOperation({ summary: 'Listar festivales, muestras y proyectos' })
  @ApiResponse({ status: 200, description: 'Lista de festivales' })
  findAll() {
    return this.festivalsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener festival por ID' })
  @ApiResponse({ status: 200, description: 'Festival encontrado' })
  @ApiResponse({ status: 404, description: 'Festival no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.festivalsService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar festival por ID' })
  @ApiResponse({ status: 200, description: 'Festival actualizado' })
  @ApiResponse({ status: 404, description: 'Festival no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body() updateFestivalDto: UpdateFestivalDto,
  ) {
    const updatedById = user.userId ?? user.sub
    return this.festivalsService.update(id, updateFestivalDto, updatedById)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar festival por ID' })
  @ApiResponse({ status: 204, description: 'Festival eliminado' })
  @ApiResponse({ status: 404, description: 'Festival no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.festivalsService.remove(id)
  }
}
