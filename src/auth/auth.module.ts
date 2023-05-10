import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../primsa.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ChatroomService } from '../chatroom/chatroom.service';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    })
  ],
  providers: [
    AuthService,
    UsersService,
    ChatroomService,
    PrismaService,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule { }
