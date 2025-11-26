import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
  @ApiProperty({
    description: 'ID da consulta relacionada',
    example: 12,
  })
  @IsNotEmpty({ message: 'O ID da consulta é obrigatório.' })
  @IsNumber({}, { message: 'O ID da consulta deve ser um número.' })
  scheduleId: number;

  @ApiProperty({
    description: 'Anamnese realizada no atendimento',
    example: 'Animal apresentou febre e apatia nos últimos dois dias.',
  })
  @IsNotEmpty({ message: 'A anamnese é obrigatória.' })
  @IsString({ message: 'A anamnese deve ser uma string.' })
  anamnesis: string;

  @ApiProperty({
    description: 'Diagnóstico identificado',
    example: 'Infecção bacteriana',
  })
  @IsNotEmpty({ message: 'O diagnóstico é obrigatório.' })
  @IsString({ message: 'O diagnóstico deve ser uma string.' })
  diagnosis: string;

  @ApiProperty({
    description: 'Tratamento recomendado',
    example: 'Antibiótico por 7 dias',
  })
  @IsNotEmpty({ message: 'O tratamento é obrigatório.' })
  @IsString({ message: 'O tratamento deve ser uma string.' })
  treatment: string;

  @ApiProperty({
    description: 'ID do veterinário responsável',
    example: 7,
  })
  @IsNotEmpty({ message: 'O ID do veterinário é obrigatório.' })
  @IsNumber({}, { message: 'O ID do veterinário deve ser um número.' })
  veterinarianId: number;
}
