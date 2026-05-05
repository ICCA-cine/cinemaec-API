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
import {
  CurrentUser,
  JwtPayload,
} from '../users/decorators/current-user.decorator'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import { AdminCatalogsService } from './admin-catalogs.service'
import { CreateAdminCatalogDto } from './dto/create-admin-catalog.dto'
import { UpdateAdminCatalogDto } from './dto/update-admin-catalog.dto'

@ApiTags('Admin Catalogs')
@Controller('admin-catalogs')
export class AdminCatalogsController {
  constructor(private readonly adminCatalogsService: AdminCatalogsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Listar catalogos activos (público)' })
  findPublicActive() {
    return this.adminCatalogsService.findPublicActive()
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Obtener catalogo activo (público) por ID' })
  findPublicById(@Param('id', ParseIntPipe) id: number) {
    return this.adminCatalogsService.findPublicById(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un catalogo administrativo' })
  @ApiResponse({ status: 201, description: 'Catalogo creado exitosamente' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createAdminCatalogDto: CreateAdminCatalogDto,
  ) {
    const userId = user.userId ?? user.sub
    return this.adminCatalogsService.create(createAdminCatalogDto, userId)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar catalogos administrativos' })
  findAll(@CurrentUser() user: JwtPayload) {
    const userId = user.userId ?? user.sub
    return this.adminCatalogsService.findAll(userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener catalogo administrativo por ID' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.userId ?? user.sub
    return this.adminCatalogsService.findOne(id, userId)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar catalogo administrativo por ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Body() updateAdminCatalogDto: UpdateAdminCatalogDto,
  ) {
    const userId = user.userId ?? user.sub
    return this.adminCatalogsService.update(id, updateAdminCatalogDto, userId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar catalogo administrativo por ID' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.userId ?? user.sub
    await this.adminCatalogsService.remove(id, userId)
  }
}
