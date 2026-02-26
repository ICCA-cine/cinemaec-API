import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MoviesService } from './movies.service'
import { MoviesController } from './movies.controller'
import { Movie } from './entities/movie.entity'
import { MovieProfessional } from './entities/movie-professional.entity'
import { MovieCompany } from './entities/movie-company.entity'
import { MovieInternationalCoproduction } from './entities/movie-international-coproduction.entity'
import { MovieFilmingCountry } from './entities/movie-filming-country.entity'
import { MovieFunding } from './entities/movie-funding.entity'
import { MovieNationalRelease } from './entities/movie-national-release.entity'
import { MovieInternationalRelease } from './entities/movie-international-release.entity'
import { MovieFestivalNomination } from './entities/movie-festival-nomination.entity'
import { MoviePlatform } from './entities/movie-platform.entity'
import { MovieContact } from './entities/movie-contact.entity'
import { MovieContentBank } from './entities/movie-content-bank.entity'
import { MovieSubtitle } from './entities/movie-subtitle.entity'
import { MovieClaimRequest } from './entities/movie-claim-request.entity'
import { Language } from '../catalog/entities/language.entity'
import { Country } from '../catalog/entities/country.entity'
import { City } from '../catalog/entities/city.entity'
import { CinematicRole } from '../catalog/entities/cinematic-role.entity'
import { SubGenre } from '../catalog/entities/subgenre.entity'
import { Asset } from '../assets/entities/asset.entity'
import { CatalogModule } from '../catalog/catalog.module'
import { ProfessionalsModule } from '../professionals/professionals.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    CatalogModule,
    ProfessionalsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      Movie,
      MovieProfessional,
      MovieCompany,
      MovieInternationalCoproduction,
      MovieFilmingCountry,
      MovieFunding,
      MovieNationalRelease,
      MovieInternationalRelease,
      MovieFestivalNomination,
      MoviePlatform,
      MovieContact,
      MovieContentBank,
      MovieSubtitle,
      MovieClaimRequest,
      Language,
      Country,
      City,
      CinematicRole,
      SubGenre,
      Asset,
      User,
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
