import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import {
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateServiceTokenDto } from './dto/create-service-token.dto';
import { ForcePasswordChangeDto } from './dto/force-password-change.dto';
import { SkipPasswordCheck } from './skip-password-check.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'JWT access token' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            crmv: { type: 'string', nullable: true },
            specialty: { type: 'string', nullable: true },
            roles: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
          },
        },
      },
    },
  })
  @Post('login')
  @SkipPasswordCheck()
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string', nullable: true },
        crmv: { type: 'string', nullable: true },
        specialty: { type: 'string', nullable: true },
        roles: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean' },
      },
    },
  })
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get('admin-profile')
  getAdminProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('veterinarian')
  @ApiBearerAuth()
  @Get('vet-profile')
  getVetProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('test-jwt')
  testJwt(@Request() req) {
    return {
      message: 'JWT funcionando!',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service token for frontend applications' })
  @ApiBody({ type: CreateServiceTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Service token created successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT token for the service',
        },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: {
          type: 'number',
          description: 'Token expiration time in seconds',
        },
        service_name: { type: 'string', description: 'Name of the service' },
        scopes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Service permissions',
        },
        description: { type: 'string', description: 'Service description' },
      },
    },
  })
  @Post('service-token')
  createServiceToken(@Body() createServiceTokenDto: CreateServiceTokenDto) {
    const { serviceName, scopes, expiresIn, description } =
      createServiceTokenDto;
    return this.authService.createServiceToken(
      serviceName,
      scopes,
      expiresIn,
      description,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Force password change for users with mustChangePassword flag' })
  @ApiBody({ type: ForcePasswordChangeDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha alterada com sucesso' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            phone: { type: 'string', nullable: true },
            crmv: { type: 'string', nullable: true },
            specialty: { type: 'string', nullable: true },
            roles: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
            mustChangePassword: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @Post('force-password-change')
  @SkipPasswordCheck()
  async forcePasswordChange(
    @Request() req,
    @Body() forcePasswordChangeDto: ForcePasswordChangeDto,
  ) {
    return this.authService.forcePasswordChange(
      req.user.id,
      forcePasswordChangeDto,
    );
  }
}
