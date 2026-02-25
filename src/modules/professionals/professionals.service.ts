import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Professional } from './entities/professional.entity'
import { CreateProfessionalDto } from './dto/create-professional.dto'
import { UpdateProfessionalDto } from './dto/update-professional.dto'
import {
  ProfessionalClaimCheckResponse,
  ProfessionalClaimResponse,
} from './dto/professional-claim-check.response'
import { User, PermissionEnum, UserRole } from '../users/entities/user.entity'
import { Profile } from '../profiles/entities/profile.entity'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationTypeEnum } from '../notifications/entities/notification.entity'
import { EmailsService } from '../emails/emails.service'

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalsRepository: Repository<Professional>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly notificationsService: NotificationsService,
    private readonly emailsService: EmailsService,
  ) {}

  async create(
    createProfessionalDto: CreateProfessionalDto,
  ): Promise<Professional> {
    const professional = this.professionalsRepository.create(
      createProfessionalDto,
    )
    return await this.professionalsRepository.save(professional)
  }

  async registerForCurrentUser(
    createProfessionalDto: CreateProfessionalDto,
    userId: number,
  ): Promise<Professional> {
    const existingOwnedProfile = await this.professionalsRepository.findOne({
      where: { ownerId: userId },
      select: ['id'],
    })

    if (existingOwnedProfile) {
      throw new ConflictException(
        'Tu usuario ya tiene un perfil profesional asociado',
      )
    }

    const professional = this.professionalsRepository.create({
      ...createProfessionalDto,
      ownerId: userId,
    })
    return await this.professionalsRepository.save(professional)
  }

  async findAll(): Promise<Professional[]> {
    return await this.professionalsRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<Professional> {
    const professional = await this.professionalsRepository.findOne({
      where: { id },
    })

    if (!professional) {
      throw new NotFoundException(`Professional with ID ${id} not found`)
    }

    return professional
  }

  async update(
    id: number,
    updateProfessionalDto: UpdateProfessionalDto,
  ): Promise<Professional> {
    const professional = await this.findOne(id)

    Object.assign(professional, updateProfessionalDto)

    return await this.professionalsRepository.save(professional)
  }

  async remove(id: number): Promise<void> {
    const professional = await this.findOne(id)
    await this.professionalsRepository.remove(professional)
  }

  async checkClaimByCurrentUser(
    userId: number,
  ): Promise<ProfessionalClaimCheckResponse> {
    const ownedProfessional = await this.professionalsRepository.findOne({
      where: { ownerId: userId },
    })

    if (ownedProfessional) {
      return {
        hasMatch: true,
        canClaim: false,
        alreadyClaimedByYou: true,
        claimedByAnotherUser: false,
        professionalId: ownedProfessional.id,
        professionalName: ownedProfessional.name,
        dniNumber: ownedProfessional.dniNumber,
        requiresSelection: false,
        nameMatches: [],
      }
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'cedula', 'profileId'],
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    const cedula = user.cedula?.trim()

    if (!cedula) {
      throw new BadRequestException('El usuario no tiene cédula registrada')
    }

    // Buscar profesionales con búsqueda flexible de cédula
    const professionals = await this.professionalsRepository.find({
      order: { id: 'ASC' },
    })

    // Normalizar la cédula del usuario (solo dígitos)
    const userCedulaDigits = cedula.replace(/\D/g, '')

    // Buscar coincidencia: primero exacta, luego por dígitos normalizados
    let professional = professionals.find(
      (p) => p.dniNumber === cedula || p.dniNumber?.trim() === cedula,
    )

    if (!professional && userCedulaDigits) {
      professional = professionals.find((p) => {
        const pDigits = (p.dniNumber || '').replace(/\D/g, '')
        return pDigits === userCedulaDigits
      })
    }

    // Si no encontró por cédula, buscar por nombre si el usuario tiene profile
    if (!professional && user.profileId) {
      const userFullName = await this.getUserFullName(userId)

      if (userFullName) {
        // Buscar profesionales sin dniNumber que coincidan por nombre
        const nameMatches = this.findProfessionalNameMatches(
          userFullName,
          professionals.filter((p) => !p.dniNumber || p.dniNumber.trim() === ''),
        )

        if (nameMatches.length === 1) {
          professional = nameMatches[0]
        } else if (nameMatches.length > 1) {
          return {
            hasMatch: true,
            canClaim: false,
            alreadyClaimedByYou: false,
            claimedByAnotherUser: false,
            professionalId: null,
            professionalName: null,
            dniNumber: null,
            requiresSelection: true,
            nameMatches: nameMatches.map((match) => ({
              id: match.id,
              name: match.name,
            })),
          }
        }
      }
    }

    if (!professional) {
      return {
        hasMatch: false,
        canClaim: false,
        alreadyClaimedByYou: false,
        claimedByAnotherUser: false,
        professionalId: null,
        professionalName: null,
        dniNumber: null,
        requiresSelection: false,
        nameMatches: [],
      }
    }

    const alreadyClaimedByYou = professional.ownerId === userId
    const claimedByAnotherUser =
      professional.ownerId !== null && professional.ownerId !== userId

    return {
      hasMatch: true,
      canClaim: professional.ownerId === null,
      alreadyClaimedByYou,
      claimedByAnotherUser,
      professionalId: professional.id,
      professionalName: professional.name,
      dniNumber: professional.dniNumber,
    }
  }

  private async getUserFullName(userId: number): Promise<string | null> {
    // Obtener el fullName del profile del usuario
    const profile = await this.profileRepository.findOne({
      where: { userId },
      select: ['fullName'],
    })

    return profile?.fullName || null
  }

  private findProfessionalNameMatches(
    userFullName: string,
    professionalsWithoutDni: Professional[],
  ): Professional[] {
    // Dividir el nombre completo del usuario en palabras
    const userNameWords = userFullName
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)

    if (userNameWords.length < 2) {
      return []
    }

    // Buscar profesionales que coincidan con al menos 2 palabras del nombre del usuario
    return professionalsWithoutDni.filter((professional) => {
      const proNameWords = professional.name
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)

      // Contar cuántas palabras del usuario coinciden en el nombre del profesional
      const matchCount = userNameWords.filter((userWord) =>
        proNameWords.some((proWord) =>
          proWord.includes(userWord) || userWord.includes(proWord),
        ),
      ).length

      // Retornar true si hay al menos 2 coincidencias
      return matchCount >= 2
    })
  }

  async claimByCurrentUser(
    userId: number,
    professionalId?: number,
  ): Promise<ProfessionalClaimResponse> {
    const checkResult = await this.checkClaimByCurrentUser(userId)

    let targetProfessionalId = checkResult.professionalId

    if (checkResult.requiresSelection) {
      if (!professionalId) {
        throw new BadRequestException(
          'Se requiere seleccionar un perfil profesional para reclamar',
        )
      }

      const nameMatches = checkResult.nameMatches || []
      const isValidSelection = nameMatches.some(
        (match) => match.id === professionalId,
      )

      if (!isValidSelection) {
        throw new BadRequestException(
          'El perfil seleccionado no coincide con tu nombre',
        )
      }

      targetProfessionalId = professionalId
    }

    if (!checkResult.hasMatch || !targetProfessionalId) {
      throw new NotFoundException(
        'No se encontró un perfil profesional asociado a tu usuario',
      )
    }

    const professional = await this.findOne(targetProfessionalId)

    if (professional.dniNumber && checkResult.requiresSelection) {
      throw new BadRequestException(
        'El perfil seleccionado tiene cédula y no es válido para reclamo por nombre',
      )
    }

    if (professional.ownerId === userId) {
      return {
        message: 'Este perfil profesional ya está asociado a tu usuario',
        professionalId: professional.id,
        ownerId: userId,
      }
    }

    const existingOwnedProfile = await this.professionalsRepository.findOne({
      where: { ownerId: userId },
      select: ['id'],
    })

    if (existingOwnedProfile && existingOwnedProfile.id !== professional.id) {
      throw new ConflictException(
        'Tu usuario ya tiene un perfil profesional asociado',
      )
    }

    if (professional.ownerId !== null && professional.ownerId !== userId) {
      throw new ConflictException(
        'Este perfil profesional ya fue reclamado por otro usuario',
      )
    }

    professional.ownerId = userId
    professional.updatedAt = new Date()

    const savedProfessional = await this.professionalsRepository.save(
      professional,
    )

    await this.notifyUserAboutProfessionalClaim(userId, savedProfessional)
    await this.notifyAdminsAboutProfessionalClaim(savedProfessional)

    return {
      message: 'Perfil profesional reclamado exitosamente',
      professionalId: savedProfessional.id,
      ownerId: savedProfessional.ownerId,
    }
  }

  private async notifyUserAboutProfessionalClaim(
    userId: number,
    professional: Professional,
  ): Promise<void> {
    try {
      await this.notificationsService.create({
        userId,
        title: 'Perfil profesional reclamado',
        message: `Tu perfil profesional "${professional.name}" ha sido reclamado exitosamente.`,
        type: NotificationTypeEnum.SUCCESS,
        link: '/professional-profile',
        referenceType: 'professional',
        referenceId: professional.id,
      })

      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['email'],
      })

      if (user?.email) {
        await this.emailsService.sendProfessionalClaimedEmail(
          user.email,
          professional.name,
        )
      }
    } catch (error) {
      console.error('Error notificando al usuario:', error)
    }
  }

  private async notifyAdminsAboutProfessionalClaim(
    professional: Professional,
  ): Promise<void> {
    try {
      const admins = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: UserRole.ADMIN })
        .andWhere(':permission = ANY(user.permissions)', {
          permission: PermissionEnum.ADMIN_PROFESSIONALS,
        })
        .getMany()

      const notificationPromises = admins.map(async (admin) => {
        await this.notificationsService.create({
          userId: admin.id,
          title: 'Perfil profesional reclamado',
          message: `Se reclamo el perfil profesional "${professional.name}" (ID ${professional.id}).`,
          type: NotificationTypeEnum.INFO,
          referenceType: 'professional',
          referenceId: professional.id,
        })

        try {
          await this.emailsService.sendAdminNotificationEmail(
            admin.email,
            'Perfil profesional reclamado',
            `Se reclamo el perfil profesional "${professional.name}" (ID ${professional.id}).`,
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
      console.error('Error notificando a admins:', error)
    }
  }
}
