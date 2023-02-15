import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/primsa.service';
import { UsersService } from '@src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtLoginDto } from './dto/jwt-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService) {

    }

    async login(username: string, password: string): Promise<JwtLoginDto> {
        const user = await this.userService.findOne(username);

        if (!user) {
            throw 'user not exist.'
        }

        if (user.password != password) {
            throw 'password wrong'
        }

        const payload = { username: user.username, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
