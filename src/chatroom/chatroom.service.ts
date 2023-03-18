import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { PrismaService } from '@src/primsa.service';
import { ChatMessage, Prisma, UserChatRoom } from '@prisma/client';

@Injectable()
export class ChatroomService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {

  }

  async getChatMsgsByUserId(userId: string): Promise<ChatMessage[]> {
    let userChatRoom: UserChatRoom = await this.prisma.userChatRoom.findFirst({
      where: {
        userId: userId
      }
    })

    if(!userChatRoom) return [];

    const msgs = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId: userChatRoom.chatRoomId
      }
    })

    return msgs;
  }

  async chat(userId: string, chatDto: ChatDto): Promise<ChatMessage> {
    let userChatRoom: UserChatRoom = await this.prisma.userChatRoom.findFirst({
      where: {
        userId: userId
      }
    })

    if (!userChatRoom) {
      const userChatroomInput: Prisma.UserChatRoomCreateInput = {
        user: {
          connect: {
            id: userId
          }
        }, 
        chatRoom: {
          create: {
            
          }
        }
      }

      userChatRoom = await this.prisma.userChatRoom.create({
        data: userChatroomInput
      });
    }


    const chatMessageInput: Prisma.ChatMessageCreateInput = {
      message: chatDto.message,
      sendBy: userId,
      chatRoom: {
        connect: {
          id: userChatRoom.chatRoomId
        }
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: chatMessageInput
    })

    return message
  }
}
