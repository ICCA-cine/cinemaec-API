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

  async findAll(): Promise<ExhibitionSpace[]> {
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
