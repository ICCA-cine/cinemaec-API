import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpacesService } from './spaces.service'
import { SpacesController } from './spaces.controller'
import { Space } from './entities/space.entity'
import { AssetsModule } from '../assets/assets.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { EmailsModule } from '../emails/emails.module'
import { User } from '../users/entities/user.entity'
import { SpaceReview } from './entities/space-review.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Space, User, SpaceReview]),
    AssetsModule,
    NotificationsModule,
    EmailsModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
