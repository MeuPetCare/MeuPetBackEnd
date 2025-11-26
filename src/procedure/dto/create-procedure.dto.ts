import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProcedureDto {
  @ApiProperty({
    description: 'Nome do procedimento',
    example: 'Castração',
  })
  @IsNotEmpty({ message: 'O nome do procedimento é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Observações sobre o procedimento',
    example: 'Procedimento realizado com sucesso',
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string.' })
  observations: string;

  @ApiPropertyOptional({
    description: 'Custo do procedimento em reais',
    example: 250.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O custo deve ser um número.' })
  cost: number;

  @ApiProperty({
    description: 'ID do atendimento relacionado',
    example: 1,
  })
  @IsNotEmpty({ message: 'O ID do atendimento é obrigatório.' })
  @IsNumber({}, { message: 'O ID do atendimento deve ser um número.' })
  medicalRecordId: number;
}
