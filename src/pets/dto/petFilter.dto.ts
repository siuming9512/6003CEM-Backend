import { ApiProperty } from "@nestjs/swagger"

export class PetFilterDto {
    @ApiProperty()
    varieties: string[]
    @ApiProperty()
    minAge: number
    @ApiProperty()
    maxAge: number
}
