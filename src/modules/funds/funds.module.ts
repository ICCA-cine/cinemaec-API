import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FundsService } from './funds.service'
import { FundsController } from './funds.controller'
import { Fund } from './entities/fund.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Fund])],
  controllers: [FundsController],
  providers: [FundsService],
  exports: [FundsService],
})
export class FundsModule {}
