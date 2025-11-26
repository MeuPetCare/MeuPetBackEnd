import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tutor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  @Roles('admin', 'veterinarian')
  create(@Body() createTutorDto: CreateTutorDto) {
    console.log('🎯 Chegou no create do TutorController');
    console.log('📦 DTO recebido:', createTutorDto);
    return this.tutorService.create(createTutorDto);
  }

  @Get()
  @Roles('admin', 'veterinarian')
  findAll() {
    return this.tutorService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'veterinarian')
  findOne(@Param('id') id: string) {
    return this.tutorService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'veterinarian')
  update(@Param('id') id: string, @Body() updateTutorDto: UpdateTutorDto) {
    return this.tutorService.update(+id, updateTutorDto);
  }

  @Delete(':id')
  @Roles('admin') // Apenas admin pode deletar
  remove(@Param('id') id: string) {
    return this.tutorService.remove(+id);
  }
}
