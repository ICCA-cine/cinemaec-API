import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Language } from './entities/language.entity'
import { Country } from './entities/country.entity'
import { Province } from './entities/province.entity'
import { City } from './entities/city.entity'
import { CinematicRole } from './entities/cinematic-role.entity'
import { SubGenre } from './entities/subgenre.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      Country,
      Province,
      City,
      CinematicRole,
      SubGenre,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class CatalogModule {}
