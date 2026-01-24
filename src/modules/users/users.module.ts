import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { EmailsModule } from '../emails/emails.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { Profile } from '../profiles/entities/profile.entity'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    EmailsModule,
    NotificationsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('env.JWT_SECRET') || 'defaultSecret',
        signOptions: {
          expiresIn:
            (configService.get<string>('env.JWT_EXPIRES_IN') as any) || '7d',
        },
      }),
    }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService, JwtStrategy, PassportModule],
})
export class UsersModule {}
