import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'novoemail@dominio.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Nome Atualizado' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'SP12345' })
  @IsString()
  @IsOptional()
  crmv?: string;

  @ApiPropertyOptional({ example: 'Clínico Geral' })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiPropertyOptional({ example: ['admin'] })
  @IsOptional()
  roles?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
