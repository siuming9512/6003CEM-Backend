import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Pet } from '@prisma/client';
import { PetEntity } from './entities/pet.entities';
import { FavouritePet } from './dto/favourite-pet.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageManager } from '@src/image/imageManager.service';
import { PetDto } from './dto/pet.dto';

@Controller('pets')
@ApiTags('pets')
@ApiBearerAuth('defaultBearerAuth')
export class PetsController {
  constructor(private petsService: PetsService, private imageManager: ImageManager) { }

  @ApiOkResponse({
    description: 'The pets records',
    type: PetEntity,
    isArray: true
  })
  @Get()
  async findAll(keyword?: string): Promise<PetDto[]> {
    return this.petsService.findAll(undefined, undefined, undefined, undefined, '836a83d4-0f83-4076-afad-0a17b5ba5303');
  }

  @ApiOkResponse({
    description: 'The pet record',
    type: PetEntity
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PetDto> {
    return this.petsService.findOne(+id);
  }

  @ApiCreatedResponse({
    description: 'The pet record created',
    type: PetEntity
  })
  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() createPetDto: CreatePetDto): Promise<PetDto> {
    // const input = this.mapper.map<Prisma.PetCreateInput>(createPetDto, '');
    return this.petsService.create(createPetDto);
  }

  @ApiOkResponse({
    description: 'The pet record updated',
    type: PetEntity
  })
  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<PetDto> {
    return this.petsService.update(+id, updatePetDto);
  }

  @ApiOkResponse({
    description: 'The pet record deleted',
    type: PetEntity
  })
  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }


  @ApiOkResponse({
    description: 'save favourite pet',
    type: PetEntity
  })
  // @UseGuards(JwtAuthGuard)
  @Post('favourite')
  async favourite(@Request() req, @Body() favouritePet: FavouritePet): Promise<boolean> {
    const userId = '836a83d4-0f83-4076-afad-0a17b5ba5303'
    // return this.petsService.favourite(req.user.userId, favouritePet.petId);
    return this.petsService.favourite(userId, favouritePet.petId);
  }

  @ApiOkResponse({
    description: 'unfavourite pet',
    type: PetEntity
  })
  // @UseGuards(JwtAuthGuard)
  @Post('unfavourite')
  async unfavourite(@Request() req, @Body() favouritePet: FavouritePet): Promise<boolean> {
    const userId = '836a83d4-0f83-4076-afad-0a17b5ba5303'
    // return this.petsService.unfavourite(req.user.userId, favouritePet.petId);
    return this.petsService.unfavourite(userId, favouritePet.petId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2000000 }, //2MB
      fileFilter(req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    const id = uuidv4();
    const fileName = `${id}.${file.mimetype.replace('image/', '')}`
    this.imageManager.saveTmpImage(fileName, file.buffer)
    return fileName;
  }
}
