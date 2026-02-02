import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Language } from './entities/language.entity'
import { Country } from './entities/country.entity'
import { Province } from './entities/province.entity'
import { City } from './entities/city.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Language, Country, Province, City])],
  exports: [TypeOrmModule],
})
export class CatalogModule {}
