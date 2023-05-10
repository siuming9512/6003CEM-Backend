import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Prisma, Pet, UserFavouritePetMapping } from '@prisma/client';
import { PetEntity } from './entities/pet.entities';
import { FavouritePet } from './dto/favourite-pet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageManager } from '../image/imageManager.service';
import { PetDto } from './dto/pet.dto';
import { Gender } from './entities/gender.enum';
import { PetFilterDto } from './dto/petFilter.dto';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { HasRoles } from '../auth/roles.decorator';

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
  async findAll(@Request() req, @Query() query): Promise<PetDto[]> {
    return this.petsService.findAll(query.variety, query.gender, +query.minAge, +query.maxAge);
  }


  @ApiOkResponse({
    description: 'The pets filter',
    type: PetFilterDto,
    isArray: true
  })
  @Get('filter')
  async getFilterOptions(): Promise<PetFilterDto> {
    // return this.petsService.unfavourite(req.user.userId, favouritePet.petId);
    return await this.petsService.getFilterOptions();
  }

  @ApiOkResponse({
    description: 'The pet record',
    type: PetEntity
  })
  @Get()
  async findOne(@Query('id') id: string): Promise<PetDto> {
    return this.petsService.findOne(+id);
  }

  @ApiCreatedResponse({
    description: 'The pet record created',
    type: PetEntity
  })
  @Post()
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createPetDto: CreatePetDto): Promise<PetDto> {
    // const input = this.mapper.map<Prisma.PetCreateInput>(createPetDto, '');
    return this.petsService.create(createPetDto);
  }

  @ApiOkResponse({
    description: 'The pet record updated',
    type: PetEntity
  })
  @Patch(':id')
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<PetDto> {
    return this.petsService.update(+id, updatePetDto);
  }

  @ApiOkResponse({
    description: 'The pet record deleted',
    type: PetEntity
  })
  @Delete(':id')
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }


  @ApiOkResponse({
    description: 'save favourite pet',
    type: Number
  })
  @HasRoles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('favourite')
  async getFavourites(@Request() req): Promise<number[]> {
    const userId = req.user.userId
    return await this.petsService.getFavourites(userId);
  }

  @HasRoles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('favourite')
  async favourite(@Request() req, @Body() favouritePet: FavouritePet): Promise<boolean> {
    const userId = req.user.userId
    // return this.petsService.favourite(req.user.userId, favouritePet.petId);
    return this.petsService.favourite(userId, favouritePet.petId);
  }

  @ApiOkResponse({
    description: 'unfavourite pet',
    type: PetEntity
  })
  @HasRoles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('unfavourite')
  async unfavourite(@Request() req, @Body() favouritePet: FavouritePet): Promise<boolean> {
    const userId = req.user.userId
    // return this.petsService.unfavourite(req.user.userId, favouritePet.petId);
    return this.petsService.unfavourite(userId, favouritePet.petId);
  }

  @Post('upload')
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
