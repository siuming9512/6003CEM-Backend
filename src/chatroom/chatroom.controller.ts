import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatDto } from './dto/chat.dto';
import { ChatMessage } from '@prisma/client';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChatMessageEntity } from './entities/chatMessage.entity';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';

@Controller('chat')
@ApiTags('chat')
@ApiBearerAuth('defaultBearerAuth')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post('')
  @ApiCreatedResponse({
    description: 'chat message saved',
    type: ChatMessageEntity
  })
  @UseGuards(JwtAuthGuard)
  async chat(@Request() req, chatDto: ChatDto): Promise<ChatMessageEntity> {
    const sent = await this.chatroomService.chat(req.user.userId, chatDto);

    return sent;
  }

  @Get('msgs')  
  @ApiOkResponse({
    description: 'get chatroom messages by user',
    type: ChatMessageEntity
  })
  @UseGuards(JwtAuthGuard)
  async getMsgs(@Request() req,): Promise<ChatMessage[]> {
    const msgs = await this.chatroomService.getChatMsgsByUserId(req.user.userId);

    return msgs;
  }
}
