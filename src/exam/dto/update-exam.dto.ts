import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data do resultado deve ser uma data válida (AAAA-MM-DD).' },
  )
  resultDate?: Date;

  @IsOptional()
  @IsString({ message: 'O status deve ser uma string.' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'O resultado deve ser uma string.' })
  result?: string;

  @IsOptional()
  @IsString({ message: 'A URL do laudo deve ser uma string.' })
  resultUrlUrl?: string;
}
