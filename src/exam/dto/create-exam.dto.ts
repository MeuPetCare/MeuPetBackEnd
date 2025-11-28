import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
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
    description: 'Data de solicitação do exame (opcional, usa data atual se não informada)',
    example: '2025-02-10',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data deve estar no formato correto (YYYY-MM-DD).' })
  requestDate?: string;

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

  @ApiProperty({
    description: 'ID do prontuário médico (opcional)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O ID do prontuário deve ser um número.' })
  medicalRecordId?: number;
}
