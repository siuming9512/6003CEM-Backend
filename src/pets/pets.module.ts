import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaService } from '@src/primsa.service';
import { ImageManager } from '@src/extensions/ImageManager';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService, ImageManager]
})
export class PetsModule {}
