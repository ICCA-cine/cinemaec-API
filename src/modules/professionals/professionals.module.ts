import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfessionalsService } from './professionals.service'
import { ProfessionalsController } from './professionals.controller'
import { Professional } from './entities/professional.entity'
import { ProfessionalPortfolioImage } from './entities/professional-portfolio-image.entity'
import { MovieProfessional } from '../movies/entities/movie-professional.entity'
import { User } from '../users/entities/user.entity'
import { Profile } from '../profiles/entities/profile.entity'
import { NotificationsModule } from '../notifications/notifications.module'
import { EmailsModule } from '../emails/emails.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Professional,
      ProfessionalPortfolioImage,
      MovieProfessional,
      User,
      Profile,
    ]),
    NotificationsModule,
    EmailsModule,
  ],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
