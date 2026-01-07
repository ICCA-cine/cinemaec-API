import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Multer } from 'multer'
import { Repository } from 'typeorm'
import { Asset } from './entities/asset.entity'
import { UploadAssetDto } from './dto/upload-asset.dto'
import { QueryAssetsDto } from './dto/query-assets.dto'
import { FirebaseService } from './services/firebase.service'

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    private firebaseService: FirebaseService,
  ) {}

  /**
   * Sube un archivo y guarda su metadata en la base de datos
   */
  async uploadAsset(
    userId: number,
    file: Multer.File,
    uploadAssetDto: UploadAssetDto,
  ): Promise<Asset> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo')
    }

    // Validar campos requeridos
    if (!uploadAssetDto.documentType || !uploadAssetDto.ownerType) {
      throw new BadRequestException(
        'documentType y ownerType son campos requeridos',
      )
    }

    // Crear path organizado por usuario y tipo de owner
    const { ownerType, ownerId, documentType } = uploadAssetDto
    let path = `users/${userId}/${ownerType.toLowerCase()}`

    if (ownerId) {
      path += `/${ownerId}`
    }

    // Subir archivo a Firebase Storage
    const { url, fullPath } = await this.firebaseService.uploadFile(file, path)

    // Guardar metadata en base de datos
    const asset = this.assetsRepository.create({
      userId,
      documentType,
      ownerType,
      ownerId: ownerId || null,
      url,
      firebasePath: fullPath,
    })

    return await this.assetsRepository.save(asset)
  }

  /**
   * Actualiza el ownerId de un asset existente
   * Útil cuando se crea el espacio después de subir los archivos
   */
  async updateAssetOwner(
    assetId: number,
    ownerId: number,
    userId: number,
  ): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({
      where: { id: assetId },
    })

    if (!asset) {
      throw new NotFoundException(`Asset con ID ${assetId} no encontrado`)
    }

    // Verificar que el asset pertenece al usuario
    if (asset.userId !== userId) {
      throw new BadRequestException(
        'No tienes permisos para actualizar este asset',
      )
    }

    asset.ownerId = ownerId
    return await this.assetsRepository.save(asset)
  }

  /**
   * Actualiza múltiples assets con el mismo ownerId
   */
  async updateMultipleAssetsOwner(
    assetIds: number[],
    ownerId: number,
    userId: number,
  ): Promise<Asset[]> {
    const assets = await this.assetsRepository.find({
      where: assetIds.map((id) => ({ id, userId })),
    })

    if (assets.length !== assetIds.length) {
      throw new BadRequestException(
        'Algunos assets no fueron encontrados o no te pertenecen',
      )
    }

    assets.forEach((asset) => {
      asset.ownerId = ownerId
    })

    return await this.assetsRepository.save(assets)
  }

  /**
   * Obtiene assets con filtros opcionales
   */
  async findAll(
    queryAssetsDto: QueryAssetsDto,
    userId?: number,
  ): Promise<Asset[]> {
    const query = this.assetsRepository.createQueryBuilder('asset')

    // Filtro opcional por usuario
    if (userId) {
      query.andWhere('asset.userId = :userId', { userId })
    }

    // Filtros desde query params
    if (queryAssetsDto.documentType) {
      query.andWhere('asset.documentType = :documentType', {
        documentType: queryAssetsDto.documentType,
      })
    }

    if (queryAssetsDto.ownerType) {
      query.andWhere('asset.ownerType = :ownerType', {
        ownerType: queryAssetsDto.ownerType,
      })
    }

    if (queryAssetsDto.ownerId) {
      query.andWhere('asset.ownerId = :ownerId', {
        ownerId: queryAssetsDto.ownerId,
      })
    }

    query.orderBy('asset.createdAt', 'DESC')

    return await query.getMany()
  }

  /**
   * Obtiene un asset por su ID
   */
  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } })

    if (!asset) {
      throw new NotFoundException(`Asset con ID ${id} no encontrado`)
    }

    return asset
  }

  /**
   * Obtiene múltiples assets por sus IDs
   * Devuelve solo los assets que existen
   */
  async findByIds(ids: number[]): Promise<Asset[]> {
    if (ids.length === 0) {
      return []
    }

    return await this.assetsRepository
      .createQueryBuilder('asset')
      .whereInIds(ids)
      .getMany()
  }

  /**
   * Reemplaza un archivo existente con uno nuevo
   */
  async replaceAsset(
    id: number,
    userId: number,
    file: Multer.File,
  ): Promise<Asset> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo')
    }

    const asset = await this.findOne(id)

    // Eliminar archivo antiguo de Firebase Storage
    if (asset.firebasePath) {
      await this.firebaseService.deleteFile(asset.firebasePath)
    }

    // Subir nuevo archivo
    let path = `${asset.ownerType.toLowerCase()}`
    if (asset.ownerId) {
      path += `/${asset.ownerId}`
    }

    const { url, fullPath } = await this.firebaseService.uploadFile(file, path)

    // Actualizar metadata
    asset.url = url
    asset.firebasePath = fullPath
    asset.userId = userId

    return await this.assetsRepository.save(asset)
  }

  /**
   * Elimina un asset y su archivo de Firebase Storage
   */
  async remove(id: number): Promise<void> {
    const asset = await this.findOne(id)

    // Eliminar de Firebase Storage
    if (asset.firebasePath) {
      await this.firebaseService.deleteFile(asset.firebasePath)
    }

    // Eliminar de base de datos
    await this.assetsRepository.remove(asset)
  }
}
