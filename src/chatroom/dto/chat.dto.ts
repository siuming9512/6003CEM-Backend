import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class ChatDto {
    @ApiProperty()
    @Length(0, 500)
    message: string
}