import { Module } from '@nestjs/common';
import { PetsModule } from './pets/pets.module';
import { FeedsModule } from './feeds/feeds.module';
import { AutomapperModule } from '@automapper/nestjs';
import { pojos } from '@automapper/pojos';

@Module({
  imports: [
    PetsModule, 
    FeedsModule, 
    AutomapperModule.forRoot({
      strategyInitializer: pojos(),
    }),],
})
export class AppModule { }
