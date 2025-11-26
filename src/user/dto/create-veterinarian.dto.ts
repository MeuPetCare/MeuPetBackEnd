// src/user/dto/create-veterinarian.dto.ts
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVeterinarianDto {
  @ApiProperty({ example: 'vet@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Carlos Oliveira' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '11987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'SP12345' })
  @IsNotEmpty()
  @IsString()
  crmv: string;

  @ApiPropertyOptional({ example: 'Clínico Geral' })
  @IsOptional()
  @IsString()
  specialty?: string;
}
