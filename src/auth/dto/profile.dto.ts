import { ApiProperty } from "@nestjs/swagger"

export class ProfileDto {
    @ApiProperty()
    userId: string
    @ApiProperty()
    username: string
    @ApiProperty()
    staffNo: string
    @ApiProperty()
    chatroomId?: number
}