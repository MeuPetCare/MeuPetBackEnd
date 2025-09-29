import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;

  @IsString() @MinLength(6) password?: string;

  @IsString() fullName: string;

  @IsOptional() @IsString() phone?: string;

  @IsOptional() @IsString() crmv?: string;

  @IsOptional() @IsString() specialty?: string;

  @IsArray() @IsString({ each: true }) roles: string[];
}
