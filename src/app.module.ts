import { Global, Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { AutomapperModule } from '@automapper/nestjs';
import { pojos } from '@automapper/pojos';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ImageManagerModule } from './image/imageManager.module';

@Module({
  imports: [
    ImageManagerModule,
    PetsModule, 
    AuthModule,
    UsersModule,
    ChatroomModule,
    AutomapperModule.forRoot({
      strategyInitializer: pojos(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    })
  ],
  // providers: [ChatGateway],
})
export class AppModule { }
