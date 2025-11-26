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
import { ProcedureService } from './procedure.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('procedure')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('procedure')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  @Roles('admin', 'veterinarian')
  create(@Body() createProcedureDto: CreateProcedureDto) {
    return this.procedureService.create(createProcedureDto);
  }

  @Get()
  @Roles('admin', 'veterinarian')
  findAll() {
    return this.procedureService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'veterinarian')
  findOne(@Param('id') id: string) {
    return this.procedureService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'veterinarian')
  update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
  ) {
    return this.procedureService.update(+id, updateProcedureDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.procedureService.remove(+id);
  }
}
