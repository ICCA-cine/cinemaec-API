import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmailsService } from '../emails/emails.service'
import { PermissionEnum, User, UserRole } from '../users/entities/user.entity'
import { CreateContactUsDto } from './dto/create-contact-us.dto'
import { ContactUsMessage } from './entities/contact-us.entity'

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUsMessage)
    private readonly contactUsRepository: Repository<ContactUsMessage>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly emailsService: EmailsService,
  ) {}

  private escapeHtml(value?: string | null): string {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  private async assertContactMessagesPermission(userId?: number): Promise<User> {
    if (!userId) {
      throw new ForbiddenException('Usuario administrador invalido')
    }

    const adminUser = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'role', 'permissions'],
    })

    const hasPermission =
      adminUser?.permissions?.includes(PermissionEnum.ADMIN_CONTACT_MESSAGES) ?? false

    if (!adminUser || adminUser.role !== UserRole.ADMIN || !hasPermission) {
      throw new ForbiddenException(
        'No tienes permisos para revisar mensajes de contacto',
      )
    }

    return adminUser
  }

  private async notifyAdminsAboutNewContactMessage(
    contactMessage: ContactUsMessage,
  ): Promise<void> {
    try {
      const admins = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: UserRole.ADMIN })
        .andWhere(':permission = ANY(user.permissions)', {
          permission: PermissionEnum.ADMIN_CONTACT_MESSAGES,
        })
        .getMany()

      const institution = contactMessage.institution
        ? this.escapeHtml(contactMessage.institution)
        : 'No especificada'
      const phone = contactMessage.phone
        ? this.escapeHtml(contactMessage.phone)
        : 'No especificado'
      const name = this.escapeHtml(contactMessage.name)
      const email = this.escapeHtml(contactMessage.email)
      const message = this.escapeHtml(contactMessage.message)

      await Promise.all(
        admins.map(async (admin) => {
          try {
            await this.emailsService.sendAdminNotificationEmail(
              admin.email,
              'Nuevo mensaje de contacto recibido',
              `Se recibió un nuevo mensaje de contacto.<br/><br/><strong>Nombre:</strong> ${name}<br/><strong>Institución:</strong> ${institution}<br/><strong>Email:</strong> ${email}<br/><strong>Número:</strong> ${phone}<br/><strong>Mensaje:</strong><br/>${message}`,
            )
          } catch (emailError) {
            console.error(
              `Error enviando email a admin ${admin.email}:`,
              emailError,
            )
          }
        }),
      )
    } catch (error) {
      console.error(
        'Error enviando notificaciones de contacto a admins:',
        error,
      )
    }
  }

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUsMessage> {
    const message = this.contactUsRepository.create({
      name: createContactUsDto.name.trim(),
      institution: createContactUsDto.institution?.trim() || null,
      email: createContactUsDto.email.trim().toLowerCase(),
      phone: createContactUsDto.phone?.trim() || null,
      message: createContactUsDto.message.trim(),
    })

    const savedMessage = await this.contactUsRepository.save(message)

    await this.notifyAdminsAboutNewContactMessage(savedMessage)

    return savedMessage
  }

  async findAll(userId?: number): Promise<ContactUsMessage[]> {
    await this.assertContactMessagesPermission(userId)

    return await this.contactUsRepository.find({
      order: { createdAt: 'DESC' },
    })
  }
}