import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { PrismaService } from '@src/primsa.service';
import { ChatMessage, ChatRoom, Prisma, UserChatRoom } from '@prisma/client';
import { Chatroom } from './entities/chatroom.entity';

@Injectable()
export class ChatroomService {
  /**
   *
   */
  constructor(private prisma: PrismaService) {

  }

  async getChatrooms(): Promise<UserChatRoom[]> {
    let chatRooms: UserChatRoom[] = await this.prisma.userChatRoom.findMany({
      where: {
        NOT: {
          chatRoom: {
            chatMessages: {
              none: {}
            }
          }
        }
      },
      include: {
        user: {
          select: {
            username: true
          }
        },
        chatRoom: {
          include: {
            chatMessages: {
              orderBy: {
                createdAt: 'desc'
              },
              select: {
                createdAt: true,
                message: true,
                sendBy: true
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        chatRoom: {
          lastChatTime: 'desc'
        }
      }
    });

    return chatRooms;
  }

  async getChatMsgsByChatroomId(chatroomId: number): Promise<ChatMessage[]> {
    let userChatRoom: UserChatRoom = await this.prisma.userChatRoom.findFirst({
      where: {
        chatRoomId: +chatroomId
      }
    })

    if (!userChatRoom) return [];

    const msgs = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId: userChatRoom.chatRoomId
      }
    })

    return msgs;
  }

  async getChatroom(userId: string): Promise<UserChatRoom> {
    let userChatroom = await this.prisma.userChatRoom.findFirst({
      where: {
        userId: userId
      }
    })

    if (!!userChatroom) {
      return userChatroom
    }

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

    userChatroom = await this.prisma.userChatRoom.create({
      data: userChatroomInput
    });

    return userChatroom
  }

  async chat(chatDto: ChatDto): Promise<ChatMessage> {
    const chatMessageInput: Prisma.ChatMessageCreateInput = {
      message: chatDto.message,
      sendBy: chatDto.sendBy,
      chatRoom: {
        connect: {
          id: chatDto.chatroomId
        }
      }
    }

    const message = await this.prisma.chatMessage.create({
      data: chatMessageInput
    })

    return message
  }
}
