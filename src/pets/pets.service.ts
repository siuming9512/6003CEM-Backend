import { INestApplication, Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, Prisma, UserFavouritePetMapping, } from '@prisma/client';
import { PrismaService } from '@src/primsa.service';
import { Gender } from './entities/gender.enum';
import { existsSync, rename, renameSync } from 'fs';
import { join } from 'path';
import { ImageManager } from '@src/image/imageManager.service';
import { PetDto } from './dto/pet.dto';
import { PetFilterDto } from './dto/petFilter.dto';

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
  async create(createPetDto: CreatePetDto): Promise<PetDto> {
    const input: Prisma.PetCreateInput = {
      variety: createPetDto.variety,
      gender: createPetDto.gender,
      age: createPetDto.age,
      imageFileName: createPetDto.imageFileName,
      live: true
    }
    const pet = await this.prisma.pet.create({
      data: input
    })

    this.imageManager.persistTmpImage(createPetDto.imageFileName);

    return this.parsePetDto(pet);
  }

  async findAll(variety?: string, gender?: Gender, minAge?: number, maxAge?: number): Promise<PetDto[]> {
    let select: Prisma.PetWhereInput = {}

    if (variety) {
      select.variety = variety
    }

    if (gender) {
      select.gender = gender
    }

    if (minAge || maxAge) {
      select.AND = [
        {
          age: { gte: +minAge, lte: +maxAge }
        }
      ]
    }

    const pets = await this.prisma.pet.findMany({
      where: select
    });

    let petDtos = await Promise.all(pets.map(async (pet: Pet) => await this.parsePetDto(pet)))

    return petDtos;
  }

  async findOne(id: number): Promise<PetDto> {
    const pet = await this.prisma.pet.findUniqueOrThrow({
      where: {
        id
      }
    })
    return this.parsePetDto(pet);
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<PetDto> {
    const updatePetInput: Prisma.PetUpdateInput = {
      variety: updatePetDto.variety,
      gender: updatePetDto.gender,
      age: updatePetDto.age,
      imageFileName: updatePetDto.imageFileName,
      live: updatePetDto.live
    }

    this.imageManager.persistTmpImage(updatePetDto.imageFileName);

    const updatedPet = await this.prisma.pet.update({
      where: {
        id
      },
      data: updatePetInput
    })

    return this.parsePetDto(updatedPet);
  }

  async remove(id: number): Promise<Pet> {
    const deletedPet = await this.prisma.pet.delete({
      where: {
        id
      }
    })

    this.imageManager.deleteImage(deletedPet.imageFileName)

    return deletedPet;
  }

  async getFavourites(userId: string): Promise<number[]> {
    const favourites = await this.prisma.userFavouritePetMapping.findMany({
      where: {
        userId: userId
      }
    })

    return favourites.map(x => x.petId);
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

  async getFilterOptions(): Promise<PetFilterDto> {
    const varieties = await this.prisma.pet.findMany({
      distinct: ['variety'],
      select: {
        variety: true
      }
    })

    const ageAgg = await this.prisma.pet.aggregate({
      _min: {
        age: true
      },
      _max: {
        age: true
      }
    })

    return {
      varieties: varieties.map(x => x.variety),
      minAge: ageAgg._min.age,
      maxAge: ageAgg._max.age,
    }
  }

  private async parsePetDto(pet: Pet): Promise<PetDto> {
    return {
      id: pet.id,
      variety: pet.variety,
      gender: pet.gender,
      age: pet.age,
      imageUrl: await this.imageManager.getImageUrl(pet.imageFileName),
      isFavourite: null
    }
  }
}
