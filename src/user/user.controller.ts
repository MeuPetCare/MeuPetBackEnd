import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiBody({ type: CreateAdminDto })
  @Post('admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const user = await this.userService.create({
      ...createAdminDto,
      passwordHash: hashedPassword,
      roles: ['admin'],
      crmv: null,
      specialty: null,
    });
    delete user.passwordHash;
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiBody({ type: CreateVeterinarianDto })
  @Post('veterinarian')
  async createVeterinarian(@Body() createUserDto: CreateVeterinarianDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      roles: ['veterinarian'],
    });
    delete user.passwordHash;
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => {
      delete user.passwordHash;
      return user;
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    if (!user) return null;
    delete user.passwordHash;
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any, // ⬅️ Pode ser admin ou vet
  ) {
    const updateData: any = {
      ...updateUserDto,
    };
    if (updateData.password) {
      updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    const updatedUser = await this.userService.update(+id, updateData);
    if (!updatedUser) return null;
    delete updatedUser.passwordHash;
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
