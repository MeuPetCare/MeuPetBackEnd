import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // ⬅️ Adicione ApiBearerAuth
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth() // ⬅️ Adicione isso
  @Get('admin-profile')
  getAdminProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('veterinarian')
  @ApiBearerAuth() // ⬅️ Adicione isso
  @Get('vet-profile')
  getVetProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard) // ⬅️ Adicione essa rota de teste
  @ApiBearerAuth()
  @Get('test-jwt')
  testJwt(@Request() req) {
    return {
      message: 'JWT funcionando!',
      user: req.user,
    };
  }
}
