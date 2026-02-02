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
import { FundsService } from './funds.service'
import { CreateFundDto } from './dto/create-fund.dto'
import { UpdateFundDto } from './dto/update-fund.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator'

@ApiTags('Funds')
@Controller('funds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo fondo/festival/premio (solo admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Fondo creado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Solo administradores',
  })
  async create(
    @CurrentUser() user: { role: string },
    @Body() createFundDto: CreateFundDto,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden crear fondos',
      )
    }
    return await this.fundsService.create(createFundDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los fondos/festivales/premios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fondos',
  })
  async findAll() {
    return await this.fundsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un fondo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Fondo encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Fondo no encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.fundsService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un fondo' })
  @ApiResponse({
    status: 200,
    description: 'Fondo actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fondo no encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFundDto: UpdateFundDto,
  ) {
    return await this.fundsService.update(id, updateFundDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un fondo' })
  @ApiResponse({
    status: 204,
    description: 'Fondo eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Fondo no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.fundsService.remove(id)
  }
}
