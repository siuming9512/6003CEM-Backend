import { ApiProperty } from "@nestjs/swagger";
import { ChatMessage } from "@prisma/client";

export class ChatMessageEntity implements ChatMessage {
    @ApiProperty()
    id: number;
    @ApiProperty()
    chatRoomId: number;
    @ApiProperty()
    message: string;
    @ApiProperty()
    sendBy: string;
    @ApiProperty()
    createdAt: Date;
}