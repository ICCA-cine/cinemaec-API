import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailsModule } from '../emails/emails.module'
import { User } from '../users/entities/user.entity'
import { ContactUsController } from './contact-us.controller'
import { ContactUsService } from './contact-us.service'
import { ContactUsMessage } from './entities/contact-us.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ContactUsMessage, User]), EmailsModule],
  controllers: [ContactUsController],
  providers: [ContactUsService],
  exports: [ContactUsService],
})
export class ContactUsModule {}