import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Festival } from './entities/festival.entity'
import { FestivalCity } from './entities/festival-city.entity'
import { FestivalCompany } from './entities/festival-company.entity'
import { FestivalStill } from './entities/festival-still.entity'
import { FestivalProfessional } from './entities/festival-professional.entity'
import { FestivalSection } from './entities/festival-section.entity'
import { FestivalModality } from './entities/festival-modality.entity'
import { FestivalsController } from './festivals.controller'
import { FestivalsService } from './festivals.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Festival,
      FestivalCity,
      FestivalCompany,
      FestivalStill,
      FestivalProfessional,
      FestivalSection,
      FestivalModality,
    ]),
  ],
  controllers: [FestivalsController],
  providers: [FestivalsService],
  exports: [FestivalsService],
})
export class FestivalsModule {}
