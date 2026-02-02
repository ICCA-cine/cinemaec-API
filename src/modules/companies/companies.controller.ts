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
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator'

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva empresa (solo admin)' })
  @ApiResponse({
    status: 201,
    description: 'Empresa creada exitosamente',
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
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden crear empresas',
      )
    }
    return await this.companiesService.create(createCompanyDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas',
  })
  async findAll() {
    return await this.companiesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.companiesService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  @ApiResponse({
    status: 200,
    description: 'Empresa actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'El RUC ya está registrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companiesService.update(id, updateCompanyDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  @ApiResponse({
    status: 204,
    description: 'Empresa eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.companiesService.remove(id)
  }
}
