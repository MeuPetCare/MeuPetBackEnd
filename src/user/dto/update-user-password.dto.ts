import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: 'NovaSenha123!' })
  @IsString()
  @MinLength(6)
  password: string;
}
