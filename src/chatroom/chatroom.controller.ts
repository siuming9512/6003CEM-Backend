import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatDto } from './dto/chat.dto';
import { ChatMessage } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post('')
  async chat(chatDto: ChatDto): Promise<boolean> {
    const sent = await this.chatroomService.chat(chatDto);

    return true;
  }

  @Get(':userId/msgs')
  findOne(@Param('userId') userId: string): Promise<ChatMessage[]> {
    return this.chatroomService.getChatMsgsByUserId(userId);
  }
}
