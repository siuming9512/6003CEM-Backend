import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@src/primsa.service';
import { Prisma, User } from '@prisma/client';
import { Role } from '@src/auth/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {

  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUserExisted(createUserDto.username)

    let staffNo = null
    let role = Role.User
    if (!!createUserDto.staffRegisterCode) {
      if (createUserDto.staffRegisterCode == "000000") {
        staffNo = `${Math.floor(100000 + Math.random() * 900000)}`
        role = Role.Admin
      } else {
        throw new BadRequestException("Staff Register Code is not valid.")
      }
    }

    const roleEntity = await this.prisma.role.findFirst({
      where: {
        name: role
      }
    })

    let roleId = ''

    if (roleEntity) {
      roleId = roleEntity.id
    }

    const saltOrRounds = 10;
    let hash = null
    
    if(createUserDto.password) {
      hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    }

    let userCreateInput: Prisma.UserCreateInput = {
      username: createUserDto.username,
      password: hash,
      staffNo: staffNo,
      userRole: {
        create: {
          role: {
            connectOrCreate: {
              where: {
                id: roleId
              },
              create: {
                name: role
              }
            }
          }
        }
      }
    }

    const user = await this.prisma.user.create({
      data: userCreateInput
    })

    return user;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        username
      },
      include: {
        userRole: {
          include: {
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return user;
  }

  private async checkUserExisted(username: string) {
    //find the user in db through prisma ORM
    const user = await this.findOne(username)
    //check user is it exist.
    if (!!user) {
      throw new BadRequestException("user existed.")
    }
  }
}
