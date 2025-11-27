import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post('admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.userService.createAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post('veterinarian')
  createVeterinarian(@Body() dto: CreateVeterinarianDto) {
    return this.userService.createVeterinarian(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updateData = { ...dto };

    return this.userService.update(+id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.userService.update(+id, { passwordHash });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('setup-first-admin')
  async setupFirstAdmin() {
    const passwordHash = await bcrypt.hash('senha', 10);
    return this.userService.create({
      email: 'admin@meupet.com',
      passwordHash,
      fullName: 'Administrador',
      roles: ['admin'],
      isActive: true,
    });
  }
}
