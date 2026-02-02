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
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PlatformsService } from './platforms.service'
import { CreatePlatformDto } from './dto/create-platform.dto'
import { UpdatePlatformDto } from './dto/update-platform.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator'

@ApiTags('Platforms')
@Controller('platforms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva plataforma (solo admin)' })
  @ApiResponse({
    status: 201,
    description: 'Plataforma creada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  async create(
    @CurrentUser() user: { role: string },
    @Body() createPlatformDto: CreatePlatformDto,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden crear plataformas',
      )
    }
    return await this.platformsService.create(createPlatformDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las plataformas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plataformas',
  })
  async findAll() {
    return await this.platformsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una plataforma por ID' })
  @ApiResponse({
    status: 200,
    description: 'Plataforma encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Plataforma no encontrada',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.platformsService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una plataforma' })
  @ApiResponse({
    status: 200,
    description: 'Plataforma actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Plataforma no encontrada',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ) {
    return await this.platformsService.update(id, updatePlatformDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una plataforma' })
  @ApiResponse({
    status: 204,
    description: 'Plataforma eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Plataforma no encontrada',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.platformsService.remove(id)
  }
}
