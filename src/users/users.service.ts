import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@src/primsa.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {
      
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUserExisted(createUserDto.username)
    
    const userCreateInput: Prisma.UserCreateInput = {
      username: createUserDto.username,
      password: createUserDto.password,
      staffNo: createUserDto.staffNo
    }
    
    try {
      const user = await this.prisma.user.create({
        data: userCreateInput
      })
  
      return user;
    } catch (error) {
      
    }
    //add user to db through prisma ORM
 
  }

  async findOne(username: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        username 
      }
    })

    return user;
  }
  
  private async checkUserExisted(username: string) {
    //find the user in db through prisma ORM
    const user = await this.findOne(username)
    //check user is it exist.
    if(!!user) {
      throw 'user existed.'
    }
  }
}
