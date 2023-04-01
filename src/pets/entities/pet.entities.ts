import { ApiProperty } from "@nestjs/swagger";
import { Pet } from "@prisma/client";

export class PetEntity implements Pet {
    @ApiProperty()
    id: number;
    @ApiProperty()
    variety: string;
    @ApiProperty()
    gender: string;
    @ApiProperty()
    age: number;
    @ApiProperty()
    imageUrl: string;
}
