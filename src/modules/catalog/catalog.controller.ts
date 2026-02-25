import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CatalogService } from './catalog.service'
import { Country } from './entities/country.entity'
import { Language } from './entities/language.entity'
import { SubGenre } from './entities/subgenre.entity'
import { CinematicRole } from './entities/cinematic-role.entity'
import { RoleCategory } from './entities/role-category.entity'
import { City } from './entities/city.entity'

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Obtener lista de países' })
  @ApiResponse({
    status: 200,
    description: 'Lista de países',
    type: [Country],
  })
  async getCountries(): Promise<Country[]> {
    return this.catalogService.getCountries()
  }

  @Get('languages')
  @ApiOperation({ summary: 'Obtener lista de idiomas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de idiomas',
    type: [Language],
  })
  async getLanguages(): Promise<Language[]> {
    return this.catalogService.getLanguages()
  }

  @Get('subgenres')
  @ApiOperation({ summary: 'Obtener lista de subgéneros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de subgéneros',
    type: [SubGenre],
  })
  async getSubGenres(): Promise<SubGenre[]> {
    return this.catalogService.getSubGenres()
  }

  @Get('cinematic-roles')
  @ApiOperation({ summary: 'Obtener lista de roles cinematográficos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles cinematográficos',
    type: [CinematicRole],
  })
  async getCinematicRoles(): Promise<CinematicRole[]> {
    return this.catalogService.getCinematicRoles()
  }

  @Get('role-categories')
  @ApiOperation({ summary: 'Obtener lista de categorías de roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías de roles',
    type: [RoleCategory],
  })
  async getRoleCategories(): Promise<RoleCategory[]> {
    return this.catalogService.getRoleCategories()
  }

  @Get('cities')
  @ApiOperation({ summary: 'Obtener lista de ciudades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciudades',
    type: [City],
  })
  async getCities(): Promise<City[]> {
    return this.catalogService.getCities()
  }
}
