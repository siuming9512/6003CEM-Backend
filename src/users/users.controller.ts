import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('defaultBearerAuth')
export class UsersController {
  constructor(private userService: UsersService) { }

  @ApiCreatedResponse({
    description: 'user created',
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto);

    return !!user;
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
