import { Global, Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaService } from '@src/primsa.service';
import { ImageManager } from '@src/image/imageManager.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PetsController],
  imports: [ConfigModule],
  providers: [PetsService, PrismaService, ImageManager]
})
export class PetsModule {}
