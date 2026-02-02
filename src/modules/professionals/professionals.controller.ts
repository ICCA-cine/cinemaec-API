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
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'

@ApiTags('Professionals')
@Controller('professionals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

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
