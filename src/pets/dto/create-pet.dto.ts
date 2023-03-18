import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEnum, IsNotEmpty, Length, Max, Min } from 'class-validator'
import { Gender } from "../entities/gender.enum"

export class CreatePetDto {
    @ApiProperty()
    @Length(1,25)
    variety: string
    @ApiProperty()
    @IsEnum(Gender)
    gender: string
    @ApiProperty()
    @Min(0)
    @Max(120)
    age: number
}
