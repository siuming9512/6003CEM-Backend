import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../primsa.service';
import { ChatroomGateway } from './chatroom.gateway';
import { ChatroomController } from './chatroom.controller';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService, ChatroomGateway]
})
export class ChatroomModule {}
