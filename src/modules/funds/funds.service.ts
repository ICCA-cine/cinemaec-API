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

  private normalizeEnumValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  private mapFundTypeToDb(value: string): string {
    const normalized = this.normalizeEnumValue(value)
    switch (normalized) {
      case 'fondo':
        return 'fondo'
      case 'festival':
        return 'festival'
      case 'premio':
        return 'premio'
      case 'espacios de participacion':
      case 'espacios_participacion':
        return 'espacios_participacion'
      default:
        return 'fondo'
    }
  }

  private mapFundTypesToDb(values: string[]): string[] {
    return values.map((value) => this.mapFundTypeToDb(value))
  }

  private mapFinancialOriginToDb(value: string): string {
    const normalized = this.normalizeEnumValue(value)
    switch (normalized) {
      case 'publico':
        return 'publico'
      case 'privado':
        return 'privado'
      case 'mixto':
        return 'mixto'
      case 'desconocido':
        return 'desconocido'
      default:
        return 'desconocido'
    }
  }

  async create(createFundDto: CreateFundDto): Promise<Fund> {
    const fund = this.fundRepository.create({
      name: createFundDto.name,
      type: this.mapFundTypesToDb(createFundDto.type) as Fund['type'],
      countryId: createFundDto.countryId,
      financialOrigin: this.mapFinancialOriginToDb(createFundDto.financialOrigin) as Fund['financialOrigin'],
    })
    return await this.fundRepository.save(fund)
  }

  async findAll(): Promise<Fund[]> {
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

    if (updateFundDto.name !== undefined) {
      fund.name = updateFundDto.name
    }

    if (updateFundDto.countryId !== undefined) {
      fund.countryId = updateFundDto.countryId
    }

    if (updateFundDto.type !== undefined) {
      fund.type = this.mapFundTypesToDb(updateFundDto.type) as Fund['type']
    }

    if (updateFundDto.financialOrigin !== undefined) {
      fund.financialOrigin = this.mapFinancialOriginToDb(updateFundDto.financialOrigin) as Fund['financialOrigin']
    }

    return await this.fundRepository.save(fund)
  }

  async remove(id: number): Promise<void> {
    const fund = await this.findOne(id)
    await this.fundRepository.remove(fund)
  }
}
