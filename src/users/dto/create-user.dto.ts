import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsStrongPassword, Length } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @Length(0, 50)
    @IsString()
    username: string
    @ApiProperty()
    @IsStrongPassword()
    password: string
    @ApiProperty()
    @IsOptional()
    staffNo?: string
}
