import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForcePasswordChangeDto {
  @ApiProperty({
    description: 'Email do usuário que está alterando a senha',
    example: 'admin@meupet.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'MeuPet2025!',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'MinhaNovaSenh@123',
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'A senha não pode ter mais de 50 caracteres' })
  newPassword: string;
}