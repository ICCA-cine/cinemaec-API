import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Asset, AssetOwnerEnum } from '../assets/entities/asset.entity'
import { Festival } from '../festivals/entities/festival.entity'
import { Movie } from '../movies/entities/movie.entity'
import { Professional } from '../professionals/entities/professional.entity'
import { PermissionEnum, User, UserRole } from '../users/entities/user.entity'
import { CreateAdminCatalogDto } from './dto/create-admin-catalog.dto'
import { UpdateAdminCatalogDto } from './dto/update-admin-catalog.dto'
import { AdminCatalog } from './entities/admin-catalog.entity'

@Injectable()
export class AdminCatalogsService {
  constructor(
    @InjectRepository(AdminCatalog)
    private readonly adminCatalogRepository: Repository<AdminCatalog>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Festival)
    private readonly festivalRepository: Repository<Festival>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  private async assertAdminCatalogPermission(userId?: number): Promise<User> {
    if (!userId) {
      throw new ForbiddenException('Usuario administrador invalido')
    }

    const adminUser = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'role', 'permissions'],
    })

    const hasAdminCatalogsPermission =
      adminUser?.permissions?.includes(PermissionEnum.ADMIN_CATALOGS) ?? false

    if (
      !adminUser ||
      adminUser.role !== UserRole.ADMIN ||
      !hasAdminCatalogsPermission
    ) {
      throw new ForbiddenException(
        'No tienes permisos para administrar catalogos',
      )
    }

    return adminUser
  }

  private async findAssetOrThrow(imageId: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { id: imageId },
    })

    if (!asset) {
      throw new NotFoundException(`Asset con ID ${imageId} no encontrado`)
    }

    return asset
  }

  private async resolveRelations(dto: {
    movieIds?: number[]
    festivalIds?: number[]
    professionalIds?: number[]
  }) {
    const movies = dto.movieIds?.length
      ? await this.movieRepository.findBy({ id: In(dto.movieIds) })
      : []

    const festivals = dto.festivalIds?.length
      ? await this.festivalRepository.findBy({ id: In(dto.festivalIds) })
      : []

    const professionals = dto.professionalIds?.length
      ? await this.professionalRepository.findBy({ id: In(dto.professionalIds) })
      : []

    return { movies, festivals, professionals }
  }

  async create(
    createAdminCatalogDto: CreateAdminCatalogDto,
    adminUserId?: number,
  ): Promise<AdminCatalog> {
    await this.assertAdminCatalogPermission(adminUserId)
    await this.findAssetOrThrow(createAdminCatalogDto.imageId)

    const created = this.adminCatalogRepository.create({
      name: createAdminCatalogDto.name.trim(),
      year: createAdminCatalogDto.year,
      imageId: createAdminCatalogDto.imageId,
      description: createAdminCatalogDto.description?.trim() || null,
      createdById: adminUserId ?? null,
      updatedById: adminUserId ?? null,
      isActive: true,
    })

    const { movies, festivals, professionals } =
      await this.resolveRelations(createAdminCatalogDto)
    created.movies = movies
    created.festivals = festivals
    created.professionals = professionals

    const saved = await this.adminCatalogRepository.save(created)

    await this.assetRepository.update(
      { id: createAdminCatalogDto.imageId },
      { ownerId: saved.id, ownerType: AssetOwnerEnum.CATALOG_IMAGE },
    )

    return this.findOne(saved.id, adminUserId)
  }

  async findPublicActive(): Promise<AdminCatalog[]> {
    return this.adminCatalogRepository.find({
      where: { isActive: true },
      relations: ['imageAsset'],
      order: { createdAt: 'DESC' },
    })
  }

  async findPublicById(id: number): Promise<AdminCatalog> {
    const catalog = await this.adminCatalogRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'imageAsset',
        'movies',
        'movies.country',
        'movies.posterAsset',
        'movies.professionals',
        'movies.professionals.professional',
        'movies.professionals.cinematicRole',
        'festivals',
        'festivals.poster',
        'professionals',
        'professionals.profilePhotoAsset',
      ],
    })

    if (!catalog) {
      throw new NotFoundException(`Catalogo con ID ${id} no encontrado`)
    }

    return catalog
  }

  async findAll(adminUserId?: number): Promise<AdminCatalog[]> {
    await this.assertAdminCatalogPermission(adminUserId)

    return this.adminCatalogRepository.find({
      relations: ['imageAsset', 'movies', 'festivals', 'professionals'],
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: number, adminUserId?: number): Promise<AdminCatalog> {
    await this.assertAdminCatalogPermission(adminUserId)

    const catalog = await this.adminCatalogRepository.findOne({
      where: { id },
      relations: ['imageAsset', 'movies', 'festivals', 'professionals'],
    })

    if (!catalog) {
      throw new NotFoundException(`Catalogo con ID ${id} no encontrado`)
    }

    return catalog
  }

  async update(
    id: number,
    updateAdminCatalogDto: UpdateAdminCatalogDto,
    adminUserId?: number,
  ): Promise<AdminCatalog> {
    await this.assertAdminCatalogPermission(adminUserId)

    const catalog = await this.adminCatalogRepository.findOne({
      where: { id },
      relations: ['imageAsset', 'movies', 'festivals', 'professionals'],
    })

    if (!catalog) {
      throw new NotFoundException(`Catalogo con ID ${id} no encontrado`)
    }

    if (updateAdminCatalogDto.name !== undefined) {
      catalog.name = updateAdminCatalogDto.name.trim()
    }

    if (updateAdminCatalogDto.year !== undefined) {
      catalog.year = updateAdminCatalogDto.year
    }

    if (updateAdminCatalogDto.description !== undefined) {
      catalog.description = updateAdminCatalogDto.description?.trim() || null
    }

    if (updateAdminCatalogDto.isActive !== undefined) {
      catalog.isActive = updateAdminCatalogDto.isActive
    }

    if (updateAdminCatalogDto.imageId !== undefined) {
      await this.findAssetOrThrow(updateAdminCatalogDto.imageId)
      catalog.imageId = updateAdminCatalogDto.imageId
      await this.assetRepository.update(
        { id: updateAdminCatalogDto.imageId },
        { ownerId: catalog.id, ownerType: AssetOwnerEnum.CATALOG_IMAGE },
      )
    }

    catalog.updatedById = adminUserId ?? catalog.updatedById

    if (updateAdminCatalogDto.movieIds !== undefined) {
      catalog.movies = updateAdminCatalogDto.movieIds.length
        ? await this.movieRepository.findBy({
            id: In(updateAdminCatalogDto.movieIds),
          })
        : []
    }

    if (updateAdminCatalogDto.festivalIds !== undefined) {
      catalog.festivals = updateAdminCatalogDto.festivalIds.length
        ? await this.festivalRepository.findBy({
            id: In(updateAdminCatalogDto.festivalIds),
          })
        : []
    }

    if (updateAdminCatalogDto.professionalIds !== undefined) {
      catalog.professionals = updateAdminCatalogDto.professionalIds.length
        ? await this.professionalRepository.findBy({
            id: In(updateAdminCatalogDto.professionalIds),
          })
        : []
    }

    await this.adminCatalogRepository.save(catalog)

    return this.findOne(catalog.id, adminUserId)
  }

  async remove(id: number, adminUserId?: number): Promise<void> {
    await this.assertAdminCatalogPermission(adminUserId)

    const catalog = await this.adminCatalogRepository.findOne({
      where: { id },
    })

    if (!catalog) {
      throw new NotFoundException(`Catalogo con ID ${id} no encontrado`)
    }

    await this.adminCatalogRepository.remove(catalog)
  }
}
