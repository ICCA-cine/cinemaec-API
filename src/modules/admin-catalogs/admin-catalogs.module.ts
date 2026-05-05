import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminCatalogsController } from './admin-catalogs.controller'
import { AdminCatalogsService } from './admin-catalogs.service'
import { AdminCatalog } from './entities/admin-catalog.entity'
import { Asset } from '../assets/entities/asset.entity'
import { Festival } from '../festivals/entities/festival.entity'
import { Movie } from '../movies/entities/movie.entity'
import { Professional } from '../professionals/entities/professional.entity'
import { User } from '../users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminCatalog,
      Asset,
      Festival,
      Movie,
      Professional,
      User,
    ]),
  ],
  controllers: [AdminCatalogsController],
  providers: [AdminCatalogsService],
  exports: [AdminCatalogsService],
})
export class AdminCatalogsModule {}
