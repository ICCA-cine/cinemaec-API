import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlatformsService } from './platforms.service'
import { PlatformsController } from './platforms.controller'
import { Platform } from './entities/platform.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  controllers: [PlatformsController],
  providers: [PlatformsService],
  exports: [PlatformsService],
})
export class PlatformsModule {}
