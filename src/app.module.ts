import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { FeedsModule } from './feeds/feeds.module';

@Module({
  imports: [PetsModule, FeedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
