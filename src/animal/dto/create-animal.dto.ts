import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty({
    description: 'Nome do animal',
    example: 'Thor',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Espécie do animal',
    example: 'Cachorro',
  })
  @IsNotEmpty({ message: 'A espécie é obrigatória.' })
  @IsString({ message: 'A espécie deve ser uma string.' })
  species: string;

  @ApiProperty({
    description: 'Raça do animal',
    example: 'Labrador',
  })
  @IsNotEmpty({ message: 'A raça é obrigatória.' })
  @IsString({ message: 'A raça deve ser uma string.' })
  breed: string;

  @ApiProperty({
    description: 'Data de nascimento do animal',
    example: '2020-08-15',
  })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  @IsDateString({}, { message: 'A data de nascimento deve ser (AAAA-MM-DD).' })
  birthDate: Date;

  @ApiPropertyOptional({
    description: 'Peso do animal em kg',
    example: 12.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O peso deve ser um número.' })
  weight: number;

  @ApiPropertyOptional({
    description: 'Sexo do animal',
    example: 'Macho',
  })
  @IsOptional()
  @IsString({ message: 'O sexo deve ser uma string.' })
  gender: string;

  @ApiProperty({
    description: 'ID do tutor',
    example: 4,
  })
  @IsNotEmpty({ message: 'O ID do tutor é obrigatório.' })
  @IsNumber({}, { message: 'O ID do tutor deve ser um número.' })
  tutorId: number;
}
