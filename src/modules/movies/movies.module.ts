import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { Movie } from './entities/movie.entity'
import { MovieProfessional } from './entities/movie-professional.entity'
import { Language } from '../catalog/entities/language.entity'
import { Country } from '../catalog/entities/country.entity'
import { Province } from '../catalog/entities/province.entity'
import { City } from '../catalog/entities/city.entity'
import { CatalogModule } from '../catalog/catalog.module'
import { ProfessionalsModule } from '../professionals/professionals.module'

@Module({
  imports: [
    CatalogModule,
    ProfessionalsModule,
    TypeOrmModule.forFeature([
      Movie,
      MovieProfessional,
      Language,
      Country,
      Province,
      City,
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
