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
  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const input: Prisma.PetCreateInput = {
      variety: createPetDto.variety,
      gender: createPetDto.gender,
      age: createPetDto.age,
    }
    const pet = await this.prisma.pet.create({
      data: input
    })

    return pet;
  }

  async findAll() {
    const pets = await this.prisma.pet.findMany();
    return pets;
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.prisma.pet.findUniqueOrThrow({
      where: {
        id
      }
    })
    return pet;
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const updatePetInput: Prisma.PetUpdateInput = {
      variety: updatePetDto.variety,
      gender: updatePetDto.gender,
      age: updatePetDto.age,
    }

    const updatedPet = await this.prisma.pet.update({
      where: {
        id
      },
      data: updatePetInput
    })

    return updatedPet;
  }

  async remove(id: number): Promise<Pet> {
    const deletedPet = await this.prisma.pet.delete({
      where: {
        id
      }
    })

    return deletedPet;
  }

  async favourite(userId: string, petId): Promise<boolean> {
    const input: Prisma.UserFavouritePetMappingCreateInput = {
      user: {
        connect: { id: userId }
      },
      pet: {
        connect: { id: petId }
      }
    }
    const favourited = await this.prisma.userFavouritePetMapping.create({
      data: input
    })

    return !!favourited;
  }

  async unfavourite(userId: string, petId): Promise<boolean> {
    const unfavourited = await this.prisma.userFavouritePetMapping.delete({
      where: {
        userId_petId: {
          userId,
          petId
        }
      }
    })

    return !!unfavourited;
  }
}
