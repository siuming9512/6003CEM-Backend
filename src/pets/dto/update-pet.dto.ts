import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePetDto extends PartialType(CreatePetDto) {
    @ApiProperty()
    live: boolean
}
