import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Platform } from './entities/platform.entity'
import { CreatePlatformDto } from './dto/create-platform.dto'
import { UpdatePlatformDto } from './dto/update-platform.dto'

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
  ) {}

  async create(createPlatformDto: CreatePlatformDto): Promise<Platform> {
    const platform = this.platformRepository.create(createPlatformDto)
    return await this.platformRepository.save(platform)
  }

  async findAll(): Promise<Platform[]> {
    return await this.platformRepository.find({
      relations: ['logo'],
      order: { name: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Platform> {
    const platform = await this.platformRepository.findOne({
      where: { id },
      relations: ['logo'],
    })

    if (!platform) {
      throw new NotFoundException(`Plataforma con ID ${id} no encontrada`)
    }

    return platform
  }

  async update(
    id: number,
    updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    const platform = await this.findOne(id)
    Object.assign(platform, updatePlatformDto)
    return await this.platformRepository.save(platform)
  }

  async remove(id: number): Promise<void> {
    const platform = await this.findOne(id)
    await this.platformRepository.remove(platform)
  }
}
