import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsStrongPassword, Length } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @Length(0, 50)
    @IsString()
    username: string
    @ApiProperty()
    password: string
    @ApiProperty()
    @IsOptional()
    staffRegisterCode?: string
}
