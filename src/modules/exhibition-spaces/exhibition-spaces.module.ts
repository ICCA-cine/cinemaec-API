import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExhibitionSpacesService } from './exhibition-spaces.service'
import { ExhibitionSpacesController } from './exhibition-spaces.controller'
import { ExhibitionSpace } from './entities/exhibition-space.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionSpace])],
  controllers: [ExhibitionSpacesController],
  providers: [ExhibitionSpacesService],
  exports: [ExhibitionSpacesService],
})
export class ExhibitionSpacesModule {}
