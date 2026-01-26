import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ProfilesService } from './profiles.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard'

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear perfil de usuario',
    description:
      'Crea un perfil para el usuario autenticado. Solo se permite un perfil por usuario.',
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya tiene un perfil creado',
  })
  create(@Request() req: any, @Body() createProfileDto: CreateProfileDto) {
    const userId: number = req.user.sub
    return this.profilesService.create(userId, createProfileDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Obtiene el perfil del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  findOne(@Request() req: any) {
    const userId: number = req.user.sub
    return this.profilesService.findByUserId(userId)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener perfil por ID',
    description: 'Obtiene un perfil específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findById(id)
  }

  @Patch()
  @ApiOperation({
    summary: 'Actualizar perfil del usuario autenticado',
    description:
      'Actualiza el perfil del usuario autenticado. No requiere el ID del perfil.',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado. Debes crear un perfil primero.',
  })
  updateOwn(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const userId: number = req.user.sub
    return this.profilesService.updateOwn(userId, updateProfileDto)
  }

  @Post('upload-agreement')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Subir acuerdo de uso de medios electrónicos',
    description:
      'Guarda el ID del documento del acuerdo firmado y marca el perfil como que tiene el acuerdo subido',
  })
  @ApiResponse({
    status: 200,
    description: 'Acuerdo subido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  async uploadAgreement(
    @Request() req: any,
    @Body('agreementDocumentId') agreementDocumentId: number,
  ) {
    const userId: number = req.user.sub
    return this.profilesService.uploadAgreement(userId, agreementDocumentId)
  }

  @Delete(':id/agreement')
  @ApiOperation({
    summary: 'Eliminar acuerdo de un perfil (solo admin)',
    description:
      'Elimina el documento de acuerdo firmado de un perfil. Solo administradores con permiso ADMIN_USERS pueden realizar esta acción.',
  })
  @ApiResponse({
    status: 200,
    description: 'Acuerdo eliminado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para realizar esta acción',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  async removeAgreement(
    @Param('id', ParseIntPipe) profileId: number,
    @Request() req: any,
  ) {
    return this.profilesService.removeAgreement(profileId)
  }
}
