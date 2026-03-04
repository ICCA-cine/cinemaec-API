import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Fund } from './entities/fund.entity'
import { CreateFundDto } from './dto/create-fund.dto'
import { UpdateFundDto } from './dto/update-fund.dto'

@Injectable()
export class FundsService {
  constructor(
    @InjectRepository(Fund)
    private readonly fundRepository: Repository<Fund>,
  ) {}

  async create(createFundDto: CreateFundDto): Promise<Fund> {
    const fund = this.fundRepository.create({
      name: createFundDto.name,
      type: createFundDto.type,
      countryId: createFundDto.countryId,
      financialOrigin: createFundDto.financialOrigin,
    })
    return await this.fundRepository.save(fund)
  }

  private async usesLegacySchema(): Promise<boolean> {
    const columns: Array<{ column_name: string }> =
      await this.fundRepository.query(
        `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'funds'
      `,
      )

    return columns.some((column) => column.column_name === 'nombre')
  }

  async findAll(): Promise<Fund[]> {
    if (await this.usesLegacySchema()) {
      const rows: Array<{
        id: number
        name: string
        type: string[]
        countryId: number
        financialOrigin: string
        country_id: number | null
        country_name: string | null
      }> = await this.fundRepository.query(
        `
        SELECT
          f.id,
          f.nombre AS "name",
          f.tipo AS "type",
          f."countryId" AS "countryId",
          f."origenFinanciero" AS "financialOrigin",
          c.id AS "country_id",
          c.name AS "country_name"
        FROM funds f
        LEFT JOIN countries c ON c.id = f."countryId"
        ORDER BY f.nombre ASC
        `,
      )

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as any,
        countryId: row.countryId,
        financialOrigin: row.financialOrigin as any,
        country: row.country_id
          ? ({ id: row.country_id, name: row.country_name } as any)
          : null,
      })) as Fund[]
    }

    return await this.fundRepository.find({
      relations: ['country'],
      order: { name: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Fund> {
    const fund = await this.fundRepository.findOne({
      where: { id },
      relations: ['country'],
    })

    if (!fund) {
      throw new NotFoundException(`Fondo con ID ${id} no encontrado`)
    }

    return fund
  }

  async update(id: number, updateFundDto: UpdateFundDto): Promise<Fund> {
    const fund = await this.findOne(id)
    Object.assign(fund, updateFundDto)
    return await this.fundRepository.save(fund)
  }

  async remove(id: number): Promise<void> {
    const fund = await this.findOne(id)
    await this.fundRepository.remove(fund)
  }
}
