import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { ChatDto } from './dto/chat.dto';
import { ChatDeleteDto } from './dto/chat-delete.dto';

@WebSocketGateway(81, { namespace: "messages", cors: true })
export class ChatroomGateway {
  constructor(private readonly chatroomService: ChatroomService) {}

  handleConnection(client){
    if(client.handshake.query.room) {
      client.join(client.handshake.query.room)
    }
  }

  @SubscribeMessage('pushMessage')
  async handleMessage(client: any, payload: ChatDto) {
    const chatMessage = await this.chatroomService.chat(payload)

    client.to(client.handshake.query.room).emit("message", chatMessage)
    client.broadcast.emit("hasNewMessage")
    client.emit("message", chatMessage)
  }

  @SubscribeMessage('deleteMessage')
  async deleteMessage(client: any, payload: ChatDeleteDto) {
    await this.chatroomService.deleteMessage(payload.messageId)

    client.to(client.handshake.query.room).emit("messageDeleted", payload.messageId)
    client.emit("messageDeleted", payload.messageId)
  }
}


