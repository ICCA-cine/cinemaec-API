import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './modules/users/users.module'
import { EmailsModule } from './modules/emails/emails.module'
import { ProfilesModule } from './modules/profiles/profiles.module'
import { AssetsModule } from './modules/assets/assets.module'
import { SpacesModule } from './modules/spaces/spaces.module'
import { ContractsModule } from './modules/contracts/contracts.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { ExhibitionSpacesModule } from './modules/exhibition-spaces/exhibition-spaces.module'
import { PlatformsModule } from './modules/platforms/platforms.module'
import { FundsModule } from './modules/funds/funds.module'
import { FirebaseModule } from './common/firebase/firebase.module'
import { getDatabaseConfig } from './config/database.config'

import envConfig from './config/env.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      expandVariables: true,
      load: [envConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    FirebaseModule,
    UsersModule,
    EmailsModule,
    ProfilesModule,
    AssetsModule,
    SpacesModule,
    ContractsModule,
    NotificationsModule,
    ExhibitionSpacesModule,
    PlatformsModule,
    FundsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
