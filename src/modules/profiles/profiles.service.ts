import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Profile } from './entities/profile.entity'
import { User } from '../users/entities/user.entity'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Crear un perfil para un usuario
   */
  async create(userId: number, createProfileDto: CreateProfileDto) {
    // Verificar si el usuario ya tiene un perfil
    const existingProfile = await this.profilesRepository.findOne({
      where: { userId },
    })

    if (existingProfile) {
      throw new ConflictException('El usuario ya tiene un perfil creado')
    }

    // Crear el perfil
    const profile = this.profilesRepository.create({
      ...createProfileDto,
      userId,
    })

    const savedProfile = await this.profilesRepository.save(profile)

    // Actualizar el profile_id en el usuario
    await this.usersRepository.update(userId, {
      profileId: savedProfile.id,
    })

    return {
      message: 'Perfil creado exitosamente',
      profile: savedProfile,
    }
  }

  /**
   * Obtener el perfil de un usuario
   */
  async findByUserId(userId: number) {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      select: [
        'id',
        'fullName',
        'legalName',
        'tradeName',
        'legalStatus',
        'birthdate',
        'province',
        'city',
        'address',
        'phone',
        'agreementDocumentId',
        'hasUploadedAgreement',
        'userId',
        'createdAt',
        'updatedAt',
      ],
    })

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado')
    }

    return profile
  }

  /**
   * Obtener un perfil por su ID
   */
  async findById(id: number) {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      select: [
        'id',
        'fullName',
        'legalName',
        'tradeName',
        'legalStatus',
        'birthdate',
        'province',
        'city',
        'address',
        'phone',
        'agreementDocumentId',
        'hasUploadedAgreement',
        'userId',
        'createdAt',
        'updatedAt',
      ],
    })

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado')
    }

    return profile
  }

  /**
   * Actualizar el perfil del usuario autenticado (sin necesidad de profileId)
   */
  async updateOwn(userId: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
    })

    if (!profile) {
      throw new NotFoundException(
        'Perfil no encontrado. Debes crear un perfil primero.',
      )
    }

    // Actualizar
    Object.assign(profile, updateProfileDto)
    const updatedProfile = await this.profilesRepository.save(profile)

    return {
      message: 'Perfil actualizado exitosamente',
      profile: updatedProfile,
    }
  }

  /**
   * Subir acuerdo de uso de medios electrónicos
   */
  async uploadAgreement(
    userId: number,
    agreementDocumentId: number,
  ): Promise<{ message: string; profile: Profile }> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
    })

    if (!profile) {
      throw new NotFoundException(
        'Perfil no encontrado. Debes crear un perfil primero.',
      )
    }

    profile.agreementDocumentId = agreementDocumentId
    profile.hasUploadedAgreement = true

    const updatedProfile = await this.profilesRepository.save(profile)

    return {
      message: 'Acuerdo subido exitosamente',
      profile: updatedProfile,
    }
  }

  /**
   * Eliminar el acuerdo de un perfil (solo admin)
   */
  async removeAgreement(
    profileId: number,
  ): Promise<{ message: string; profile: Profile }> {
    const profile = await this.profilesRepository.findOne({
      where: { id: profileId },
    })

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado')
    }

    profile.agreementDocumentId = null
    profile.hasUploadedAgreement = false

    const updatedProfile = await this.profilesRepository.save(profile)

    return {
      message: 'Acuerdo eliminado exitosamente',
      profile: updatedProfile,
    }
  }
}
