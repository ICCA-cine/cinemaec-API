import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfessionalsService } from './professionals.service'
import { ProfessionalsController } from './professionals.controller'
import { Professional } from './entities/professional.entity'
import { User } from '../users/entities/user.entity'
import { Profile } from '../profiles/entities/profile.entity'
import { NotificationsModule } from '../notifications/notifications.module'
import { EmailsModule } from '../emails/emails.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional, User, Profile]),
    NotificationsModule,
    EmailsModule,
  ],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
