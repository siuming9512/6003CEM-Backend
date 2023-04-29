import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/primsa.service';
import { UsersService } from '@src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtLoginDto } from './dto/jwt-login.dto';
import { ProfileDto } from './dto/profile.dto';
import { ChatroomService } from '@src/chatroom/chatroom.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private chatService: ChatroomService,
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

        const payload = { username: user.username, staffNo: user.staffNo, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            expiresIn: 30 * 86400
        };
    }

    async profile(username: string): Promise<ProfileDto> {
        const user = await this.userService.findOne(username)

        if(!user) return null

        const dto: ProfileDto = {
            userId: user.id,
            username: user.username,
            staffNo: user.staffNo,
        }

        const chatroom = await this.chatService.getChatroom(user.id)
        if(chatroom) {
            dto.chatroomId = chatroom.chatRoomId
        }

        return dto
    }
}
