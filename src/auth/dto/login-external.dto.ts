import { ApiProperty } from "@nestjs/swagger"

export class LoginExternalDto {
    @ApiProperty()
    token: string
}