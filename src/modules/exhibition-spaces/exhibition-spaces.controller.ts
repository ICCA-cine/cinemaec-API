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
import { ExhibitionSpacesService } from './exhibition-spaces.service'
import { CreateExhibitionSpaceDto } from './dto/create-exhibition-space.dto'
import { UpdateExhibitionSpaceDto } from './dto/update-exhibition-space.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator'

@ApiTags('Exhibition Spaces')
@Controller('exhibition-spaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExhibitionSpacesController {
  constructor(
    private readonly exhibitionSpacesService: ExhibitionSpacesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo espacio de exhibición (solo admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Espacio de exhibición creado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  @ApiResponse({
    status: 409,
    description: 'El RUC ya está registrado',
  })
  async create(
    @CurrentUser() user: { role: string },
    @Body() createExhibitionSpaceDto: CreateExhibitionSpaceDto,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden crear espacios de exhibición',
      )
    }
    return await this.exhibitionSpacesService.create(createExhibitionSpaceDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los espacios de exhibición' })
  @ApiResponse({
    status: 200,
    description: 'Lista de espacios de exhibición',
  })
  async findAll() {
    return await this.exhibitionSpacesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio de exhibición por ID' })
  @ApiResponse({
    status: 200,
    description: 'Espacio de exhibición encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de exhibición no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.exhibitionSpacesService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un espacio de exhibición' })
  @ApiResponse({
    status: 200,
    description: 'Espacio de exhibición actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de exhibición no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El RUC ya está registrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExhibitionSpaceDto: UpdateExhibitionSpaceDto,
  ) {
    return await this.exhibitionSpacesService.update(
      id,
      updateExhibitionSpaceDto,
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un espacio de exhibición' })
  @ApiResponse({
    status: 204,
    description: 'Espacio de exhibición eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Espacio de exhibición no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exhibitionSpacesService.remove(id)
  }
}
