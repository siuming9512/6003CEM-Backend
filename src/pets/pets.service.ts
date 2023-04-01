import { INestApplication, Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, Prisma, } from '@prisma/client';
import { PrismaService } from '@src/primsa.service';
import { Gender } from './entities/gender.enum';
import { existsSync, rename, renameSync } from 'fs';
import { join } from 'path';
import { ImageManager } from '@src/extensions/ImageManager';

@Injectable()
export class PetsService {
  /**
   *
   */
  constructor(
    private prisma: PrismaService,
    private imageManager: ImageManager
  ) {

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

    this.imageManager.persistTmpImage(createPetDto.fileId);

    pet.imageUrl = await this.imageManager.getImageUrl(createPetDto.fileId);

    return pet;
  }

  async findAll(variety?: string, gender?: Gender, minAge?: number, maxAge?: number) {
    const pets = await this.prisma.pet.findMany({
      where: {
        variety,
        gender,
        AND: [
          {
            age: { gte: minAge, lte: maxAge }
          }
        ]
      }
    });

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
