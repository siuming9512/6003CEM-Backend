import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Pet } from '@prisma/client';
import { Feed } from '@src/feeds/entities/feed.entity';
import { PetEntity } from './entities/pet.entities';
@Controller('pets')
@ApiTags('pets')
export class PetsController {
  constructor(private petsService: PetsService) { }


  @ApiOkResponse({
    description: 'The pets records',
    type: PetEntity,
    isArray: true
  })
  @Get()
  async findAll(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @ApiOkResponse({
    description: 'The pet record',
    type: PetEntity
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pet> {
    return this.petsService.findOne(+id);
  }

  @ApiCreatedResponse({
    description: 'The pet record created',
    type: PetEntity
  })
  @Post()
  async create(@Body() createPetDto: CreatePetDto): Promise<Pet> {
    // const input = this.mapper.map<Prisma.PetCreateInput>(createPetDto, '');
    return this.petsService.create(createPetDto);
  }

  @ApiOkResponse({
    description: 'The pet record updated',
    type: PetEntity
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<Pet> {
    return this.petsService.update(+id, updatePetDto);
  }

  @ApiOkResponse({
    description: 'The pet record deleted',
    type: PetEntity
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }
}
