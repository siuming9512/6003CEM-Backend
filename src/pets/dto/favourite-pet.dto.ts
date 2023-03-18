import { ApiProperty } from "@nestjs/swagger"
import { IsInt } from "class-validator"

export class FavouritePet {
    @ApiProperty()
    @IsInt()
    petId: number
}
