import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Country } from './entities/country.entity'
import { Language } from './entities/language.entity'
import { SubGenre } from './entities/subgenre.entity'
import { CinematicRole } from './entities/cinematic-role.entity'
import { RoleCategory } from './entities/role-category.entity'
import { City } from './entities/city.entity'

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(SubGenre)
    private readonly subGenreRepository: Repository<SubGenre>,
    @InjectRepository(CinematicRole)
    private readonly cinematicRoleRepository: Repository<CinematicRole>,
    @InjectRepository(RoleCategory)
    private readonly roleCategoryRepository: Repository<RoleCategory>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCountries(): Promise<Country[]> {
    return this.countryRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async getLanguages(): Promise<Language[]> {
    return this.languageRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async getSubGenres(): Promise<SubGenre[]> {
    return this.subGenreRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async getCinematicRoles(): Promise<CinematicRole[]> {
    return this.cinematicRoleRepository.find({
      order: {
        idRoleCategory: 'ASC',
        name: 'ASC',
      },
      relations: ['roleCategory'],
    })
  }

  async getRoleCategories(): Promise<RoleCategory[]> {
    return this.roleCategoryRepository.find({
      order: {
        id: 'ASC',
      },
    })
  }

  async getCities(): Promise<City[]> {
    return this.cityRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }
}
