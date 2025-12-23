import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Space } from './entities/space.entity'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'
import { QuerySpacesDto } from './dto/query-spaces.dto'
import { AssetsService } from '../assets/assets.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationTypeEnum } from '../notifications/entities/notification.entity'
import { User, UserRole, PermissionEnum } from '../users/entities/user.entity'
import {
  SpaceReview,
  SpaceReviewDecisionEnum,
} from './entities/space-review.entity'
import { SubmitSpaceReviewDto } from './dto/submit-space-review.dto'

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private spacesRepository: Repository<Space>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SpaceReview)
    private spaceReviewsRepository: Repository<SpaceReview>,
    private assetsService: AssetsService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Obtiene los assets completos para un espacio
   * Devuelve un objeto con los assets organizados por tipo
   */
  private async getSpaceAssets(space: Space) {
    try {
      const assetIds = [
        space.logoId,
        ...(Array.isArray(space.photosId) ? space.photosId : []),
        space.ciDocument,
        space.managerDocument,
        space.serviceBill,
        space.operatingLicense,
      ]

      if (space.rucDocument) {
        assetIds.push(space.rucDocument)
      }

      // Filtrar IDs válidos
      const validAssetIds = assetIds.filter(
        (id) => id && typeof id === 'number',
      )

      if (validAssetIds.length === 0) {
        return {
          logo: null,
          photos: [],
          documents: {
            ci: null,
            ruc: null,
            manager: null,
            serviceBill: null,
            operatingLicense: null,
          },
        }
      }

      // Obtener todos los assets
      const assets = await this.assetsService.findByIds(validAssetIds)

      // Crear un mapa de assets por ID para acceso rápido
      const assetMap = new Map(assets.map((asset) => [asset.id, asset]))

      return {
        logo: assetMap.get(space.logoId) || null,
        photos: (Array.isArray(space.photosId) ? space.photosId : [])
          .map((id) => assetMap.get(id))
          .filter((a) => a !== undefined),
        documents: {
          ci: assetMap.get(space.ciDocument) || null,
          ruc: space.rucDocument
            ? assetMap.get(space.rucDocument) || null
            : null,
          manager: assetMap.get(space.managerDocument) || null,
          serviceBill: assetMap.get(space.serviceBill) || null,
          operatingLicense: assetMap.get(space.operatingLicense) || null,
        },
      }
    } catch (error) {
      // Si hay error al obtener los assets, devolver estructura vacía
      console.error('Error obteniendo assets del espacio:', error)
      return {
        logo: null,
        photos: [],
        documents: {
          ci: null,
          ruc: null,
          manager: null,
          serviceBill: null,
          operatingLicense: null,
        },
      }
    }
  }

  /**
   * Crear un nuevo espacio
   */
  async create(userId: number, createSpaceDto: CreateSpaceDto): Promise<Space> {
    const space = this.spacesRepository.create({
      ...createSpaceDto,
      userId,
    })

    const savedSpace = await this.spacesRepository.save(space)

    // Actualizar ownerId de todos los assets asociados
    const assetIds = [
      createSpaceDto.logoId,
      ...createSpaceDto.photosId,
      createSpaceDto.ciDocument,
      createSpaceDto.managerDocument,
      createSpaceDto.serviceBill,
      createSpaceDto.operatingLicense,
    ]

    // Agregar rucDocument si existe
    if (createSpaceDto.rucDocument) {
      assetIds.push(createSpaceDto.rucDocument)
    }

    // Actualizar ownerId de todos los assets
    try {
      await this.assetsService.updateMultipleAssetsOwner(
        assetIds,
        savedSpace.id,
        userId,
      )
    } catch (error) {
      // Si falla la actualización de assets, no revertir la creación del espacio
      console.error('Error actualizando ownerId de assets:', error)
    }

    // Notificar al usuario que creó el espacio
    await this.notifyUserAboutSpaceCreation(userId, savedSpace)

    // Notificar a todos los admins con permiso admin_spaces
    await this.notifyAdminsAboutNewSpace(savedSpace)

    return savedSpace
  }

  /**
   * Notificar al usuario sobre la creación exitosa del espacio
   */
  private async notifyUserAboutSpaceCreation(
    userId: number,
    space: Space,
  ): Promise<void> {
    try {
      await this.notificationsService.create({
        userId,
        title: 'Espacio registrado exitosamente',
        message: `Tu espacio "${space.name}" ha sido registrado. La información será revisada en un lapso máximo de 15 días.`,
        type: NotificationTypeEnum.SUCCESS,
        link: `/spaces/${space.id}`,
        referenceType: 'space',
        referenceId: space.id,
      })
    } catch (error) {
      console.error('Error enviando notificación al usuario:', error)
    }
  }

  /**
   * Notificar a admins con permiso admin_spaces sobre nuevo espacio
   */
  private async notifyAdminsAboutNewSpace(space: Space): Promise<void> {
    try {
      // Buscar todos los usuarios admin con el permiso admin_spaces
      const admins = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: UserRole.ADMIN })
        .andWhere(':permission = ANY(user.permissions)', {
          permission: PermissionEnum.ADMIN_SPACES,
        })
        .getMany()

      // Crear notificación para cada admin
      const notificationPromises = admins.map((admin) =>
        this.notificationsService.create({
          userId: admin.id,
          title: 'Nuevo espacio registrado',
          message: `Se ha registrado un nuevo espacio: "${space.name}" en ${space.city}, ${space.province}`,
          type: NotificationTypeEnum.INFO,
          link: `/spaces/${space.id}`,
          referenceType: 'space',
          referenceId: space.id,
        }),
      )

      await Promise.all(notificationPromises)
    } catch (error) {
      console.error('Error enviando notificaciones a admins:', error)
    }
  }

  /**
   * Enviar revisión de un espacio (solo admins con permiso admin_spaces)
   */
  async submitReview(
    spaceId: number,
    reviewerUserId: number,
    dto: SubmitSpaceReviewDto,
  ): Promise<SpaceReview> {
    const space = await this.findOne(spaceId)

    const reviewer = await this.usersRepository.findOne({
      where: { id: reviewerUserId },
    })
    if (!reviewer || reviewer.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Solo administradores pueden revisar espacios',
      )
    }
    const hasPermission =
      Array.isArray(reviewer.permissions) &&
      reviewer.permissions.includes(PermissionEnum.ADMIN_SPACES)
    if (!hasPermission) {
      throw new ForbiddenException('No tienes permiso para revisar espacios')
    }

    const review = this.spaceReviewsRepository.create({
      spaceId: space.id,
      reviewerUserId,
      decision: dto.decision,
      generalComment: dto.generalComment ?? null,
      issues: dto.issues ?? null,
    })

    const saved = await this.spaceReviewsRepository.save(review)

    // Cambios de estado según decisión
    if (dto.decision === SpaceReviewDecisionEnum.APPROVE) {
      await this.updateSpaceStatus(space.id, 'verified')
      await this.notificationsService.create({
        userId: space.userId,
        title: 'Espacio verificado',
        message: `Tu espacio "${space.name}" ha sido verificado.`,
        type: NotificationTypeEnum.SUCCESS,
        link: `/spaces/${space.id}`,
        referenceType: 'space',
        referenceId: space.id,
      })
    } else if (dto.decision === SpaceReviewDecisionEnum.REQUEST_CHANGES) {
      await this.updateSpaceStatus(space.id, 'under_review')
      const issuesText = (dto.issues || [])
        .map((i) => `• ${i.field}: ${i.comment}`)
        .join('\n')
      await this.notificationsService.create({
        userId: space.userId,
        title: 'Se requieren correcciones en tu espacio',
        message: `Por favor corrige los siguientes puntos:\n${issuesText}`,
        type: NotificationTypeEnum.WARNING,
        link: `/spaces/${space.id}/edit`,
        referenceType: 'space',
        referenceId: space.id,
      })
    } else if (dto.decision === SpaceReviewDecisionEnum.REJECT) {
      await this.updateSpaceStatus(space.id, 'rejected')
      await this.notificationsService.create({
        userId: space.userId,
        title: 'Espacio rechazado',
        message:
          dto.generalComment ||
          'Tu espacio ha sido rechazado. Revisa los requisitos.',
        type: NotificationTypeEnum.ERROR,
        link: `/spaces/${space.id}`,
        referenceType: 'space',
        referenceId: space.id,
      })
    }

    return saved
  }

  /**
   * Obtener el historial de revisiones de un espacio
   */
  async getReviewsBySpace(
    spaceId: number,
    requesterId: number,
  ): Promise<SpaceReview[]> {
    const space = await this.findOne(spaceId)

    // Permitir al dueño ver sus revisiones, y admins con admin_spaces
    const requester = await this.usersRepository.findOne({
      where: { id: requesterId },
    })
    const isOwner = space.userId === requesterId
    const isAdminWithPermission =
      requester?.role === UserRole.ADMIN &&
      Array.isArray(requester.permissions) &&
      requester.permissions.includes(PermissionEnum.ADMIN_SPACES)

    if (!isOwner && !isAdminWithPermission) {
      throw new ForbiddenException(
        'No tienes permisos para ver estas revisiones',
      )
    }

    return this.spaceReviewsRepository.find({
      where: { spaceId },
      order: { createdAt: 'DESC' },
    })
  }

  /**
   * Obtener todos los espacios con filtros y paginación
   */
  async findAll(queryDto: QuerySpacesDto): Promise<{
    data: Space[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const { page = 1, limit = 10, ...filters } = queryDto

    const queryBuilder = this.spacesRepository.createQueryBuilder('space')

    // Aplicar filtros
    if (filters.type) {
      queryBuilder.andWhere('space.type = :type', { type: filters.type })
    }

    if (filters.status) {
      queryBuilder.andWhere('space.status = :status', {
        status: filters.status,
      })
    }

    if (filters.province) {
      queryBuilder.andWhere('space.province = :province', {
        province: filters.province,
      })
    }

    if (filters.city) {
      queryBuilder.andWhere('space.city = :city', { city: filters.city })
    }

    if (filters.name) {
      queryBuilder.andWhere('space.name ILIKE :name', {
        name: `%${filters.name}%`,
      })
    }

    if (filters.userId) {
      queryBuilder.andWhere('space.userId = :userId', {
        userId: filters.userId,
      })
    }

    // Paginación
    const skip = (page - 1) * limit
    queryBuilder.skip(skip).take(limit)

    // Ordenar por fecha de creación (más recientes primero)
    queryBuilder.orderBy('space.createdAt', 'DESC')

    // Ejecutar consulta
    const [data, total] = await queryBuilder.getManyAndCount()

    // Obtener assets para cada espacio
    const dataWithAssets = await Promise.all(
      data.map(async (space) => {
        const assets = await this.getSpaceAssets(space)
        return {
          ...space,
          assets,
        }
      }),
    )

    return {
      data: dataWithAssets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Obtener espacios del usuario autenticado
   */
  async findMySpaces(
    userId: number,
    queryDto: QuerySpacesDto,
  ): Promise<{
    data: Space[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    return this.findAll({ ...queryDto, userId })
  }

  /**
   * Obtener un espacio por ID
   */
  async findOne(id: number): Promise<any> {
    const space = await this.spacesRepository.findOne({ where: { id } })

    if (!space) {
      throw new NotFoundException(`Espacio con ID ${id} no encontrado`)
    }

    // Obtener los assets completos
    const assets = await this.getSpaceAssets(space)

    return {
      ...space,
      assets,
    }
  }

  /**
   * Actualizar un espacio
   * Solo el propietario puede actualizar su espacio
   */
  async update(
    id: number,
    userId: number,
    updateSpaceDto: UpdateSpaceDto,
  ): Promise<Space> {
    const space = await this.findOne(id)

    // Verificar que el usuario sea el propietario
    if (space.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar este espacio',
      )
    }

    // Actualizar los campos
    Object.assign(space, updateSpaceDto)

    return await this.spacesRepository.save(space)
  }

  /**
   * Eliminar un espacio
   * Solo el propietario puede eliminar su espacio
   */
  async remove(id: number, userId: number): Promise<void> {
    const space = await this.findOne(id)

    // Verificar que el usuario sea el propietario
    if (space.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este espacio',
      )
    }

    await this.spacesRepository.remove(space)
  }

  /**
   * Cambiar el estado de un espacio (para administradores)
   */
  async updateStatus(id: number, status: string): Promise<Space> {
    const space = await this.findOne(id)

    space.status = status as any

    return await this.spacesRepository.save(space)
  }

  /**
   * Validar que los IDs de assets existan
   * Esta función puede ser llamada antes de crear/actualizar para validar
   */
  validateAssetIds(assetIds: number[]): boolean {
    // Aquí podrías hacer una consulta a la tabla assets si necesitas validación estricta
    // Por ahora, solo verificamos que sean números válidos
    if (!assetIds || assetIds.length === 0) {
      return true
    }

    const areValidIds = assetIds.every((id) => Number.isInteger(id) && id > 0)

    if (!areValidIds) {
      throw new BadRequestException(
        'Los IDs de assets deben ser enteros positivos',
      )
    }

    return true
  }

  /**
   * Actualizar el contractId de un espacio
   */
  async updateContractId(spaceId: number, contractId: number): Promise<Space> {
    const space = await this.findOne(spaceId)
    space.contractId = contractId
    return await this.spacesRepository.save(space)
  }

  /**
   * Actualizar el estado de un espacio
   */
  async updateSpaceStatus(
    spaceId: number,
    status:
      | 'pending'
      | 'verified'
      | 'rejected'
      | 'active'
      | 'inactive'
      | 'under_review',
  ): Promise<Space> {
    const space = await this.findOne(spaceId)
    space.status = status as any
    return await this.spacesRepository.save(space)
  }
}
