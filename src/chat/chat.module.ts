import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatroomService } from "@src/chatroom/chatroom.service";

@Module({
    imports: [
        ChatroomService
    ],
    providers: [
        ChatGateway
    ]
})

export class ChatModule {}