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

  private async usesLegacySchema(): Promise<boolean> {
    const columns: Array<{ column_name: string }> =
      await this.platformRepository.query(
        `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'platforms'
      `,
      )

    return columns.some((column) => column.column_name === 'nombre')
  }

  async findAll(): Promise<Platform[]> {
    if (await this.usesLegacySchema()) {
      const rows: Array<{
        id: number
        name: string
        type: string
        logoId: number | null
        logo_id: number | null
        logo_url: string | null
      }> = await this.platformRepository.query(
        `
        SELECT
          p.id,
          p.nombre AS "name",
          p.tipo AS "type",
          p."logoId" AS "logoId",
          a.id AS "logo_id",
          a.url AS "logo_url"
        FROM platforms p
        LEFT JOIN assets a ON a.id = p."logoId"
        ORDER BY p.nombre ASC
        `,
      )

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as any,
        logoId: row.logoId,
        logo: row.logo_id
          ? ({ id: row.logo_id, url: row.logo_url } as any)
          : null,
      })) as Platform[]
    }

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
