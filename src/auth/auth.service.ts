import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../primsa.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtLoginDto } from './dto/jwt-login.dto';
import { ProfileDto } from './dto/profile.dto';
import { ChatroomService } from '../chatroom/chatroom.service';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

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
            throw new BadRequestException('user not exist.')
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new BadRequestException('password wrong')
        }

        const role = user["userRole"][0].role.name

        const payload = { username: user.username, staffNo: user.staffNo, sub: user.id, roles: [role] };

        return {
            access_token: this.jwtService.sign(payload),
            expiresIn: 30 * 86400
        };
    }


    async loginExternal(token: string): Promise<JwtLoginDto> {
        const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)

        let user = await this.userService.findOne(data.email);

        if (!user) {
            user = await this.userService.create({
                username: data.email
            })
        }
        const role = user["userRole"][0].role.name

        const payload = { username: user.username, staffNo: user.staffNo, sub: user.id, roles: [role] };

        return {
            access_token: this.jwtService.sign(payload),
            expiresIn: 30 * 86400
        };
    }

    async profile(username: string): Promise<ProfileDto> {
        const user = await this.userService.findOne(username)

        if (!user) return null

        const dto: ProfileDto = {
            userId: user.id,
            username: user.username,
            staffNo: user.staffNo,
        }

        const chatroom = await this.chatService.getChatroom(user.id)
        if (chatroom) {
            dto.chatroomId = chatroom.chatRoomId
        }

        return dto
    }
}
