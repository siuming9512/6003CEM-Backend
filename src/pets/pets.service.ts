import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, Prisma } from '@prisma/client';
import { PrismaService } from '@src/primsa.service';

@Injectable()
export class PetsService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {
    
  }
  create(createPetDto: CreatePetDto): Promise<Pet> {
    const input: Prisma.PetCreateInput = {
      variety: createPetDto.variety,
      gender: createPetDto.gender,
      age: createPetDto.age,
    }
    const pet = this.prisma.pet.create({
      data: input
    })

    return pet;
  }

  findAll() {
    const pets = this.prisma.pet.findMany();
    return pets;
  }

  findOne(id: number): Promise<Pet> {
    const pet = this.prisma.pet.findUniqueOrThrow({
      where: {
        id
      }
    })
    return pet;
  }

  update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const updatePetInput: Prisma.PetUpdateInput = {
      variety: updatePetDto.variety,
      gender: updatePetDto.gender,
      age: updatePetDto.age,
    }

    const updatedPet = this.prisma.pet.update({
      where: {
        id
      },
      data: updatePetInput
    })

    return updatedPet;
  }

  remove(id: number): Promise<Pet> {
    const deletedPet = this.prisma.pet.delete({
      where: {
        id
      }
    })

    return deletedPet;
  }
}
