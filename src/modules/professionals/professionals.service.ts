import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Professional } from './entities/professional.entity'
import { CreateProfessionalDto } from './dto/create-professional.dto'
import { UpdateProfessionalDto } from './dto/update-professional.dto'

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalsRepository: Repository<Professional>,
  ) {}

  async create(
    createProfessionalDto: CreateProfessionalDto,
  ): Promise<Professional> {
    const professional = this.professionalsRepository.create(
      createProfessionalDto,
    )
    return await this.professionalsRepository.save(professional)
  }

  async findAll(): Promise<Professional[]> {
    return await this.professionalsRepository.find({
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<Professional> {
    const professional = await this.professionalsRepository.findOne({
      where: { id },
    })

    if (!professional) {
      throw new NotFoundException(`Professional with ID ${id} not found`)
    }

    return professional
  }

  async update(
    id: number,
    updateProfessionalDto: UpdateProfessionalDto,
  ): Promise<Professional> {
    const professional = await this.findOne(id)

    Object.assign(professional, updateProfessionalDto)

    return await this.professionalsRepository.save(professional)
  }

  async remove(id: number): Promise<void> {
    const professional = await this.findOne(id)
    await this.professionalsRepository.remove(professional)
  }
}
