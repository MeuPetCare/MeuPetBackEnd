import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, Min } from 'class-validator';

export class CreateServiceTokenDto {
  @ApiProperty({ 
    example: 'frontend-dashboard', 
    description: 'Name identifier for the service' 
  })
  @IsString()
  serviceName: string;

  @ApiProperty({ 
    example: ['read:animals', 'write:schedules'], 
    description: 'Array of permissions/scopes for the service token',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

  @ApiProperty({ 
    example: 3600, 
    description: 'Token expiration time in seconds (default: 1 day)',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  expiresIn?: number;

  @ApiProperty({ 
    example: 'Token for frontend dashboard service', 
    description: 'Optional description of the service token',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;
}