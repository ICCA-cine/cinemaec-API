import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Multer } from 'multer'
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AssetsService } from './assets.service'
import { UploadAssetDto } from './dto/upload-asset.dto'
import { QueryAssetsDto } from './dto/query-assets.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'
import {
  CurrentUser,
  JwtPayload,
} from '../users/decorators/current-user.decorator'
import { Asset } from './entities/asset.entity'

@ApiTags('Assets')
@Controller('assets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * Subir un archivo
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir un archivo a Firebase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo y metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir',
        },
        documentType: {
          type: 'string',
          enum: ['image', 'video', 'document', 'logo', 'other'],
          description: 'Tipo de documento',
        },
        ownerType: {
          type: 'string',
          enum: [
            'space_logo',
            'space_photo',
            'space_document',
            'user_bc_photo',
            'user_agreement',
            'company_logo',
            'company_photos',
            'location_photos',
            'movie_stills',
            'movie_poster',
          ],
          description: 'Tipo de propietario',
        },
        ownerId: {
          type: 'integer',
          description: 'ID del propietario (opcional)',
        },
      },
      required: ['file', 'documentType', 'ownerType'],
    },
  })
  async uploadAsset(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Multer.File,
    @Body('documentType') documentType: string,
    @Body('ownerType') ownerType: string,
    @Body('ownerId') ownerId?: string,
  ): Promise<Asset> {
    // Construir el DTO manualmente y transformar tipos
    const uploadAssetDto: UploadAssetDto = {
      documentType: documentType as any,
      ownerType: ownerType as any,
      ownerId: ownerId ? parseInt(ownerId, 10) : undefined,
      file,
    }

    return this.assetsService.uploadAsset(user.userId, file, uploadAssetDto)
  }

  /**
   * Obtener todos los assets con filtros
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los assets con filtros opcionales' })
  async findAll(@Query() queryAssetsDto: QueryAssetsDto): Promise<Asset[]> {
    return this.assetsService.findAll(queryAssetsDto)
  }

  /**
   * Obtener assets del usuario autenticado
   */
  @Get('my-assets')
  @ApiOperation({ summary: 'Obtener mis assets' })
  async findMyAssets(
    @CurrentUser() user: JwtPayload,
    @Query() queryAssetsDto: QueryAssetsDto,
  ): Promise<Asset[]> {
    return this.assetsService.findAll(queryAssetsDto, user.userId)
  }

  /**
   * Obtener un asset por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un asset por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Asset> {
    return this.assetsService.findOne(id)
  }

  /**
   * Reemplazar un archivo existente
   */
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Reemplazar un archivo existente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Nuevo archivo',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Nuevo archivo',
        },
      },
      required: ['file'],
    },
  })
  async replaceAsset(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Multer.File,
  ): Promise<Asset> {
    return this.assetsService.replaceAsset(id, user.userId, file)
  }

  /**
   * Eliminar un asset
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un asset' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.assetsService.remove(id)
    return { message: 'Asset eliminado correctamente' }
  }
}
