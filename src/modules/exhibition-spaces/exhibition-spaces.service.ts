import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExhibitionSpace } from './entities/exhibition-space.entity'
import { CreateExhibitionSpaceDto } from './dto/create-exhibition-space.dto'
import { UpdateExhibitionSpaceDto } from './dto/update-exhibition-space.dto'

@Injectable()
export class ExhibitionSpacesService {
  constructor(
    @InjectRepository(ExhibitionSpace)
    private readonly exhibitionSpaceRepository: Repository<ExhibitionSpace>,
  ) {}

  async create(
    createExhibitionSpaceDto: CreateExhibitionSpaceDto,
  ): Promise<ExhibitionSpace> {
    const exhibitionSpace = this.exhibitionSpaceRepository.create(
      createExhibitionSpaceDto,
    )
    return await this.exhibitionSpaceRepository.save(exhibitionSpace)
  }

  private async usesLegacySchema(): Promise<boolean> {
    const columns: Array<{ column_name: string }> =
      await this.exhibitionSpaceRepository.query(
        `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'exhibition_spaces'
      `,
      )

    return columns.some((column) => column.column_name === 'nombre')
  }

  async findAll(): Promise<ExhibitionSpace[]> {
    if (await this.usesLegacySchema()) {
      const rows: Array<{
        id: number
        name: string
        countryId: number
        country_id: number | null
        country_name: string | null
      }> = await this.exhibitionSpaceRepository.query(
        `
        SELECT
          e.id,
          e.nombre AS "name",
          e."countryId" AS "countryId",
          c.id AS "country_id",
          c.name AS "country_name"
        FROM exhibition_spaces e
        LEFT JOIN countries c ON c.id = e."countryId"
        ORDER BY e.nombre ASC
        `,
      )

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        countryId: row.countryId,
        country: row.country_id
          ? ({ id: row.country_id, name: row.country_name } as any)
          : null,
      })) as ExhibitionSpace[]
    }

    return await this.exhibitionSpaceRepository.find({
      relations: ['country'],
      order: { name: 'ASC' },
    })
  }

  async findOne(id: number): Promise<ExhibitionSpace> {
    const exhibitionSpace = await this.exhibitionSpaceRepository.findOne({
      where: { id },
      relations: ['country'],
    })

    if (!exhibitionSpace) {
      throw new NotFoundException(
        `Espacio de exhibición con ID ${id} no encontrado`,
      )
    }

    return exhibitionSpace
  }

  async update(
    id: number,
    updateExhibitionSpaceDto: UpdateExhibitionSpaceDto,
  ): Promise<ExhibitionSpace> {
    const exhibitionSpace = await this.findOne(id)
    Object.assign(exhibitionSpace, updateExhibitionSpaceDto)
    return await this.exhibitionSpaceRepository.save(exhibitionSpace)
  }

  async remove(id: number): Promise<void> {
    const exhibitionSpace = await this.findOne(id)
    await this.exhibitionSpaceRepository.remove(exhibitionSpace)
  }
}
