import { ApiProperty } from "@nestjs/swagger"

export class JwtLoginDto {
    @ApiProperty()
    access_token: string
}