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
    const fund = this.fundRepository.create(createFundDto)
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
    Object.assign(fund, updateFundDto)
    return await this.fundRepository.save(fund)
  }

  async remove(id: number): Promise<void> {
    const fund = await this.findOne(id)
    await this.fundRepository.remove(fund)
  }
}
