import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfessionalsService } from './professionals.service'
import { ProfessionalsController } from './professionals.controller'
import { Professional } from './entities/professional.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Professional])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
