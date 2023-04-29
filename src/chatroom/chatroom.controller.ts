import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatDto } from './dto/chat.dto';
import { ChatMessage, ChatRoom, UserChatRoom } from '@prisma/client';
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
  // @UseGuards(JwtAuthGuard)
  async chat(@Body() chatDto: ChatDto): Promise<ChatMessageEntity> {
    const sent = await this.chatroomService.chat(chatDto);

    return sent;
  }

  @Get('msgs/:chatroomId')  
  @ApiOkResponse({
    description: 'get chatroom messages by user',
    type: ChatMessageEntity
  })
  // @UseGuards(JwtAuthGuard)
  async getMsgs(@Param('chatroomId') chatroomId: number): Promise<ChatMessage[]> {
    // const msgs = await this.chatroomService.getChatMsgsByUserId(req.user.userId);
    const msgs = await this.chatroomService.getChatMsgsByChatroomId(chatroomId);

    return msgs;
  }
  
  @Get('chatrooms')  
  @ApiOkResponse({
    description: 'get chatrooms by admin',
    type: ChatMessageEntity
  })
  // @UseGuards(JwtAuthGuard)
  async getChatrooms(): Promise<UserChatRoom[]> {
    // const msgs = await this.chatroomService.getChatMsgsByUserId(req.user.userId);
    const chatrooms = await this.chatroomService.getChatrooms();

    return chatrooms;
  }

  @Get('chatroom/:userId')  
  @ApiOkResponse({
    description: 'get chatroom by user',
    type: ChatMessageEntity
  })
  // @UseGuards(JwtAuthGuard)
  async getChatroomByUserId(@Param('userId') userId: string): Promise<UserChatRoom> {
    const chatroom = await this.chatroomService.getChatroom(userId);

    return chatroom;
  }
}
