import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Data e hora da consulta',
    example: '2025-02-10T14:30:00Z',
  })
  @IsNotEmpty({ message: 'A data e hora são obrigatórias.' })
  @IsDateString(
    {},
    {
      message:
        'A data e hora devem ser uma data válida (AAAA-MM-DDTHH:MM:SSZ).',
    },
  )
  dateHour: Date;

  @ApiProperty({
    description: 'Motivo da consulta',
    example: 'Vômito e apatia',
  })
  @IsNotEmpty({ message: 'O motivo é obrigatório.' })
  @IsString({ message: 'O motivo deve ser uma string.' })
  reason: string;

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
