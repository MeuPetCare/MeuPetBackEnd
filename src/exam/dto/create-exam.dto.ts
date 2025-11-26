import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    description: 'Nome do exame',
    example: 'Hemograma',
  })
  @IsNotEmpty({ message: 'O nome do exame é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiProperty({
    description: 'Data de solicitação do exame',
    example: '2025-02-10',
  })
  @IsNotEmpty({ message: 'A data de solicitação é obrigatória.' })
  @IsDateString(
    {},
    { message: 'A data de solicitação deve ser uma data válida (AAAA-MM-DD).' },
  )
  requestDate: Date;

  @ApiProperty({
    description: 'ID do animal',
    example: 3,
  })
  @IsNotEmpty({ message: 'O ID do animal é obrigatório.' })
  @IsNumber({}, { message: 'O ID do animal deve ser um número.' })
  animalId: number;

  @ApiProperty({
    description: 'ID do veterinário',
    example: 7,
  })
  @IsNotEmpty({ message: 'O ID do veterinário é obrigatório.' })
  @IsNumber({}, { message: 'O ID do veterinário deve ser um número.' })
  veterinarianId: number;
}
