import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { AutomapperModule } from '@automapper/nestjs';
import { pojos } from '@automapper/pojos';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    PetsModule, 
    AuthModule,
    AutomapperModule.forRoot({
      strategyInitializer: pojos(),
    }), AuthModule, UsersModule, ChatroomModule,],
})
export class AppModule { }
