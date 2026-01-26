import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { User, UserRole, PermissionEnum } from './entities/user.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto'
import {
  LoginResponseDto,
  UserProfileResponseDto,
} from './dto/user-response.dto'
import { EmailsService } from '../emails/emails.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationTypeEnum } from '../notifications/entities/notification.entity'
import { Profile } from '../profiles/entities/profile.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private emailsService: EmailsService,
    private notificationsService: NotificationsService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(registerDto: RegisterDto): Promise<{
    message: string
    userId: number
  }> {
    const { email, cedula, password } = registerDto

    // Verificar si el email ya existe
    const existingEmail = await this.usersRepository.findOne({
      where: { email },
    })
    if (existingEmail) {
      throw new ConflictException('El email ya está registrado')
    }

    // Verificar si la cédula ya existe
    const existingCedula = await this.usersRepository.findOne({
      where: { cedula },
    })
    if (existingCedula) {
      throw new ConflictException('La cédula ya está registrada')
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generar token de verificación
    const emailVerificationToken = randomBytes(32).toString('hex')

    // Crear el usuario
    const user = this.usersRepository.create({
      email,
      cedula,
      password: hashedPassword,
      isActive: false,
      emailVerificationToken: emailVerificationToken,
    })

    // Guardar en la base de datos
    const savedUser = await this.usersRepository.save(user)

    // Enviar email de verificación
    await this.emailsService.sendVerificationEmail(
      email,
      emailVerificationToken,
    )

    return {
      message:
        'Usuario registrado exitosamente. Por favor verifica tu email para activar tu cuenta.',
      userId: savedUser.id,
    }
  }

  /**
   * Autentica un usuario y devuelve un token JWT
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto

    // Buscar usuario por email (incluyendo el password y permissions)
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .addSelect('user.permissions')
      .getOne()

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    // Verificar que la cuenta esté activa
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Tu cuenta no está activa. Contacta al administrador.',
      )
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    // Verificar si tiene perfil
    const profile = await this.profilesRepository.findOne({
      where: { userId: user.id },
    })
    const hasProfile = !!profile

    // Actualizar last_login
    user.lastLogin = new Date()
    await this.usersRepository.save(user)

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      cedula: user.cedula,
      role: user.role,
    }
    const accessToken = this.jwtService.sign(payload)

    // Devolver permisos tal cual vienen de la BD
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        cedula: user.cedula,
        role: user.role,
        isActive: user.isActive,
        hasProfile: hasProfile,
        permissions: user.permissions,
      },
    }
  }

  /**
   * Verifica el email de un usuario mediante el token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    // Buscar usuario por token
    const user = await this.usersRepository.findOne({
      where: { emailVerificationToken: token },
    })

    if (!user) {
      throw new BadRequestException('Token de verificación inválido o expirado')
    }

    if (user.isActive) {
      throw new BadRequestException('El email ya ha sido verificado')
    }

    // Activar usuario
    user.isActive = true
    user.emailVerificationToken = null

    await this.usersRepository.save(user)

    // Notificar a admins con permiso admin_users sobre el nuevo usuario registrado
    await this.notifyAdminsAboutNewUser(user)

    return {
      message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
    }
  }

  /**
   * Notificar a todos los admins con permiso admin_users sobre un nuevo usuario registrado
   */
  private async notifyAdminsAboutNewUser(user: User): Promise<void> {
    try {
      // Buscar todos los usuarios admin con el permiso admin_users
      const admins = await this.usersRepository
        .createQueryBuilder('admin')
        .where('admin.role = :role', { role: UserRole.ADMIN })
        .andWhere(':permission = ANY(admin.permissions)', {
          permission: PermissionEnum.ADMIN_USERS,
        })
        .getMany()

      // Crear notificación para cada admin y enviar email
      const notificationPromises = admins.map(async (admin) => {
        // Crear notificación en DB
        await this.notificationsService.create({
          userId: admin.id,
          title: 'Nuevo usuario registrado',
          message: `Se ha registrado un nuevo usuario: ${user.email} (Cédula: ${user.cedula})`,
          type: NotificationTypeEnum.SUCCESS,
          link: `/users/${user.id}`,
          referenceType: 'user',
          referenceId: user.id,
        })

        // Enviar email de notificación
        try {
          await this.emailsService.sendAdminNotificationEmail(
            admin.email,
            'Nuevo usuario registrado en la plataforma',
            `Se ha registrado un nuevo usuario en CinemaEC:\n\nEmail: ${user.email}\nCédula: ${user.cedula}\n\nPor favor revísalo en la plataforma.`,
          )
        } catch (emailError) {
          console.error(
            `Error enviando email a admin ${admin.email}:`,
            emailError,
          )
        }
      })

      await Promise.all(notificationPromises)
    } catch (error) {
      console.error('Error enviando notificaciones a admins:', error)
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(userId: number): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta ha sido desactivada')
    }

    // Verificar si tiene perfil y si ha subido el acuerdo
    const profile = await this.profilesRepository.findOne({
      where: { userId: user.id },
      select: ['id', 'hasUploadedAgreement'],
    })
    const hasProfile = !!profile
    const hasUploadedAgreement = profile?.hasUploadedAgreement || false

    return {
      id: user.id,
      email: user.email,
      cedula: user.cedula,
      role: user.role,
      isActive: user.isActive,
      hasProfile: hasProfile,
      hasUploadedAgreement: hasUploadedAgreement,
      lastLogin: user.lastLogin,
      permissions: user.permissions,
    }
  }

  /**
   * Cambiar contraseña del usuario autenticado
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    })

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado')
    }

    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta')
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar contraseña
    await this.usersRepository.update(userId, {
      password: hashedPassword,
    })

    return {
      message: 'Contraseña actualizada exitosamente',
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
    })

    // Por seguridad, siempre devolvemos el mismo mensaje aunque el email no exista
    if (!user) {
      return {
        message:
          'Si el email existe, recibirás un enlace para restablecer tu contraseña.',
      }
    }

    // Generar token de recuperación (válido por 1 hora)
    const resetToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    // Guardar token
    await this.usersRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: expiresAt,
    })

    // Enviar email con el token
    await this.emailsService.sendPasswordResetEmail(email, resetToken)

    return {
      message:
        'Si el email existe, recibirás un enlace para restablecer tu contraseña.',
    }
  }

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { passwordResetToken: token },
    })

    if (!user) {
      throw new BadRequestException('Token inválido o expirado')
    }

    // Verificar que el token no haya expirado
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('El token ha expirado')
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar contraseña y limpiar tokens
    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    })

    return {
      message:
        'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.',
    }
  }

  /**
   * Actualizar permisos de un usuario (solo admins)
   */
  async updateUserPermissions(
    userId: number,
    adminId: number,
    updateUserPermissionsDto: UpdateUserPermissionsDto,
  ): Promise<User> {
    // Verificar que el solicitante es admin
    const admin = await this.usersRepository.findOne({
      where: { id: adminId },
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      )
    }

    // Obtener el usuario a actualizar
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`)
    }

    // Validar que solo admins puedan tener permisos
    if (user.role === UserRole.ADMIN) {
      // Admins deben tener permisos especificados
      if (
        !updateUserPermissionsDto.permissions ||
        updateUserPermissionsDto.permissions.length === 0
      ) {
        throw new BadRequestException(
          'Los administradores deben tener al menos un permiso asignado',
        )
      }
      user.permissions = updateUserPermissionsDto.permissions
    } else {
      // Usuarios normales no deben tener permisos
      user.permissions = null
    }

    return await this.usersRepository.save(user)
  }

  /**
   * Obtener información de un usuario
   */
  async getUserInfo(userId: number, requesterId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`)
    }

    const requester = await this.usersRepository.findOne({
      where: { id: requesterId },
    })

    // Información pública
    const userInfo = {
      id: user.id,
      email: user.email,
      cedula: user.cedula,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    // Si es admin o el mismo usuario, agregar información adicional
    if (requester?.role === UserRole.ADMIN || userId === requesterId) {
      return {
        ...userInfo,
        permissions: user.permissions,
        lastLogin: user.lastLogin,
        profileId: user.profileId,
      }
    }

    return userInfo
  }

  /**
   * Obtener todos los usuarios (solo admins con assign_roles)
   */
  async getAllUsers(adminId: number): Promise<any[]> {
    // Verificar que el solicitante es admin con permiso assign_roles
    const admin = await this.usersRepository.findOne({
      where: { id: adminId },
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      )
    }

    const hasPermission =
      Array.isArray(admin.permissions) &&
      admin.permissions.includes(PermissionEnum.ASSIGN_ROLES)
    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes permiso para ver la lista de usuarios',
      )
    }

    // Obtener todos los usuarios
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    })

    // Retornar información de usuarios
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      cedula: user.cedula,
      role: user.role,
      isActive: user.isActive,
      permissions: user.permissions,
      profileId: user.profileId,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }))
  }

  /**
   * Desactivar o activar un usuario (solo admin)
   */
  async toggleUserStatus(userId: number, isActive: boolean): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    user.isActive = isActive
    const updatedUser = await this.usersRepository.save(user)

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      cedula: updatedUser.cedula,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      permissions: updatedUser.permissions,
      profileId: updatedUser.profileId,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
    }
  }

  /**
   * Cambiar rol y permisos de un usuario (solo admin)
   */
  async updateUserRole(
    userId: number,
    adminId: number,
    updateUserRoleDto: any,
  ): Promise<any> {
    // Verificar que el solicitante es admin con permiso assign_roles
    const admin = await this.usersRepository.findOne({
      where: { id: adminId },
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      )
    }

    const hasPermission =
      Array.isArray(admin.permissions) &&
      admin.permissions.includes(PermissionEnum.ASSIGN_ROLES)
    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes permiso para cambiar roles de usuarios',
      )
    }

    // Obtener usuario a actualizar
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    // Actualizar rol
    if (updateUserRoleDto.role) {
      user.role = updateUserRoleDto.role
    }

    // Actualizar permisos si es admin
    if (
      updateUserRoleDto.role === UserRole.ADMIN &&
      updateUserRoleDto.permissions
    ) {
      user.permissions = updateUserRoleDto.permissions
    } else if (updateUserRoleDto.role !== UserRole.ADMIN) {
      // Limpiar permisos si ya no es admin
      user.permissions = []
    }

    const updatedUser = await this.usersRepository.save(user)

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      cedula: updatedUser.cedula,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      permissions: updatedUser.permissions,
      profileId: updatedUser.profileId,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
    }
  }
}
