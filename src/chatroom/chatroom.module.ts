import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { PrismaService } from '@src/primsa.service';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService]
})
export class ChatroomModule {}
