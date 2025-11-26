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
import { MedicalRecordService } from './medicalRecord.service';
import { CreateMedicalRecordDto } from './dto/create-medicalRecord.dto';
import { UpdateMedicalRecordDto } from './dto/update-medicalRecord.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('medicalRecord')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medicalRecord')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Roles('admin', 'veterinarian')
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordService.create(createMedicalRecordDto);
  }

  @Get()
  @Roles('admin', 'veterinarian')
  findAll() {
    return this.medicalRecordService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'veterinarian')
  findOne(@Param('id') id: string) {
    return this.medicalRecordService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'veterinarian')
  update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordService.update(+id, updateMedicalRecordDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.medicalRecordService.remove(+id);
  }
}
