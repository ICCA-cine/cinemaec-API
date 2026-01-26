import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario con email, cédula y contraseña.',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de registro',
        value: {
          email: 'usuario@ejemplo.com',
          cedula: '1234567890',
          password: 'Password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    content: {
      'application/json': {
        example: {
          message:
            'Usuario registrado exitosamente. Por favor verifica tu email para activar tu cuenta.',
          userId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email o cédula ya registrados',
    content: {
      'application/json': {
        examples: {
          emailDuplicado: {
            summary: 'Email duplicado',
            value: {
              statusCode: 409,
              message: 'El email ya está registrado',
              error: 'Conflict',
            },
          },
          cedulaDuplicada: {
            summary: 'Cédula duplicada',
            value: {
              statusCode: 409,
              message: 'La cédula ya está registrada',
              error: 'Conflict',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'El email debe ser válido',
            'La contraseña debe tener al menos 6 caracteres',
          ],
          error: 'Bad Request',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto)
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar email de usuario',
    description:
      'Verifica el email de un usuario mediante el token enviado por correo electrónico.',
  })
  @ApiBody({
    type: VerifyEmailDto,
    examples: {
      ejemplo1: {
        summary: 'Token de verificación',
        value: {
          token:
            '266a9ed3e405c69f0a0c6f5c13011d0f392d237a4b2af0196735691557c74866',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado exitosamente',
    content: {
      'application/json': {
        example: {
          message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o email ya verificado',
    content: {
      'application/json': {
        examples: {
          tokenInvalido: {
            summary: 'Token inválido',
            value: {
              statusCode: 400,
              message: 'Token de verificación inválido o expirado',
              error: 'Bad Request',
            },
          },
          yaVerificado: {
            summary: 'Email ya verificado',
            value: {
              statusCode: 400,
              message: 'El email ya ha sido verificado',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto.token)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica un usuario y devuelve un token JWT. La cuenta debe estar activa.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      ejemplo1: {
        summary: 'Credenciales de usuario',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'Password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            email: 'usuario@ejemplo.com',
            cedula: '1234567890',
            role: 'user',
            isActive: true,
            hasProfile: true,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas o cuenta inactiva',
    content: {
      'application/json': {
        examples: {
          credencialesIncorrectas: {
            summary: 'Credenciales incorrectas',
            value: {
              statusCode: 401,
              message: 'Credenciales incorrectas',
              error: 'Unauthorized',
            },
          },
          cuentaInactiva: {
            summary: 'Cuenta inactiva',
            value: {
              statusCode: 401,
              message: 'Tu cuenta no está activa. Contacta al administrador.',
              error: 'Unauthorized',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['El email debe ser válido', 'La contraseña es obligatoria'],
          error: 'Bad Request',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Valida el token JWT y devuelve la información actualizada del usuario. Útil para verificar la sesión al recargar la página.',
  })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    schema: {
      example: {
        id: 1,
        email: 'usuario@example.com',
        cedula: '1234567890',
        role: 'user',
        isActive: true,
        hasProfile: true,
        lastLogin: '2025-11-19T20:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o usuario no autorizado',
  })
  async getProfile(@Request() req: any) {
    const userId: number = req.user.sub
    return this.usersService.getProfile(userId)
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar contraseña',
    description:
      'Permite al usuario autenticado cambiar su contraseña. Requiere la contraseña actual.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'Contraseña actual incorrecta o token inválido',
  })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId: number = req.user.sub
    return this.usersService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    )
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description:
      'Envía un email con un enlace para restablecer la contraseña. Por seguridad, siempre devuelve el mismo mensaje.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de confirmación enviado',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto.email)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Restablece la contraseña usando el token enviado por email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    )
  }

  @Put(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar permisos de un usuario (Admin)',
    description: 'Permite a un admin actualizar los permisos de otro usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Permisos actualizados exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para realizar esta acción',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async updateUserPermissions(
    @Param('id', ParseIntPipe) userId: number,
    @Request() req: any,
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
  ) {
    const adminId = req.user.sub
    return this.usersService.updateUserPermissions(
      userId,
      adminId,
      updateUserPermissionsDto,
    )
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Activar o desactivar un usuario',
    description:
      'Permite a un administrador activar o desactivar un usuario. Requiere permiso ADMIN_USERS.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para realizar esta acción',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async toggleUserStatus(
    @Param('id', ParseIntPipe) userId: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersService.toggleUserStatus(userId, isActive)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener información de un usuario',
    description:
      'Obtiene la información pública de un usuario. Admins pueden ver información adicional.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUser(
    @Param('id', ParseIntPipe) userId: number,
    @Request() req: any,
  ) {
    const requesterId = req.user.sub
    return this.usersService.getUserInfo(userId, requesterId)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los usuarios (Admin)',
    description:
      'Obtiene la lista completa de usuarios con sus roles y permisos. Requiere ser ADMIN con permiso assign_roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            email: 'admin@example.com',
            cedula: '1234567890',
            role: 'admin',
            isActive: true,
            permissions: ['admin_spaces', 'admin_movies', 'admin_users'],
            profileId: 1,
            lastLogin: '2024-12-23T10:30:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            email: 'user@example.com',
            cedula: '0987654321',
            role: 'user',
            isActive: true,
            permissions: null,
            profileId: 2,
            lastLogin: '2024-12-22T15:20:00.000Z',
            createdAt: '2024-02-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para realizar esta acción',
  })
  async getAllUsers(@Request() req: any) {
    const adminId = req.user.sub
    return this.usersService.getAllUsers(adminId)
  }
}
