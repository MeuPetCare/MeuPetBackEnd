import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@meupet.com', description: 'E-mail do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'S3nh@F0rte!',
    minLength: 6,
    description: 'Senha do usuário',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
