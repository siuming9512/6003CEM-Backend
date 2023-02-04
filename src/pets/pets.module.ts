import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaService } from '@src/primsa.service';

@Module({
  controllers: [PetsController],
  providers: [PetsService, PrismaService]
})
export class PetsModule {}
