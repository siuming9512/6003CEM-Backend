import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(883, { namespace: "messages", cors: true })
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
