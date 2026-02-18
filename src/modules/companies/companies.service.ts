import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Company } from './entities/company.entity'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    if (createCompanyDto.ruc) {
      const existingCompany = await this.companiesRepository.findOne({
        where: { ruc: createCompanyDto.ruc },
      })

      if (existingCompany) {
        throw new ConflictException('El RUC ya está registrado')
      }
    }

    const company = this.companiesRepository.create(createCompanyDto)
    return await this.companiesRepository.save(company)
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find({
      relations: ['country'],
      order: {
        nombre: 'ASC',
      },
    })
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['country'],
    })

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`)
    }

    return company
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id)

    if (updateCompanyDto.ruc && updateCompanyDto.ruc !== company.ruc) {
      const existingCompany = await this.companiesRepository.findOne({
        where: { ruc: updateCompanyDto.ruc },
      })

      if (existingCompany) {
        throw new ConflictException('El RUC ya está registrado')
      }
    }

    Object.assign(company, updateCompanyDto)

    return await this.companiesRepository.save(company)
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id)
    await this.companiesRepository.remove(company)
  }
}
