import { ApiProperty } from "@nestjs/swagger"

export class FavouritePet {
    @ApiProperty()
    petId: number
}
