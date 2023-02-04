import { ApiProperty } from "@nestjs/swagger"

export class CreatePetDto {
    @ApiProperty()
    variety: string
    @ApiProperty()
    gender: string
    @ApiProperty()
    age: number
}
