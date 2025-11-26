import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsMobilePhone,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTutorDto {
  @ApiProperty({
    description: 'Nome do tutor',
    example: 'Carlos Oliveira',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Telefone do tutor',
    example: '11987654321',
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsMobilePhone('pt-BR', undefined, {
    message: 'O telefone deve ser válido.',
  })
  telephone: string;

  @ApiProperty({
    description: 'E-mail do tutor',
    example: 'carlos@email.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  email: string;

  @ApiProperty({
    description: 'CPF do tutor',
    example: '12345678900',
  })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString({ message: 'O CPF deve ser uma string.' })
  cpf: string;

  @ApiPropertyOptional({
    description: 'Endereço do tutor',
    example: 'Rua das Flores, 123',
  })
  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string.' })
  address: string;
}
