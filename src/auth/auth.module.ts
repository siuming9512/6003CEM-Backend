import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from '@src/users/users.service';
import { PrismaService } from '@src/primsa.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ChatroomService } from '@src/chatroom/chatroom.service';

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
