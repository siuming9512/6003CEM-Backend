import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsInt } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {

}
