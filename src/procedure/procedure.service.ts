import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Procedure } from './procedure.entity';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { MedicalRecordService } from '../medicalRecord/medicalRecord.service';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Procedure)
    private procedureRepository: Repository<Procedure>,
    private medicalRecordService: MedicalRecordService,
  ) {}

  async create(createProcedureDto: CreateProcedureDto): Promise<Procedure> {
    // Verifica se o medicalRecord existe
    await this.medicalRecordService.findOne(createProcedureDto.medicalRecordId);

    const procedure = this.procedureRepository.create(createProcedureDto);
    return this.procedureRepository.save(procedure);
  }

  async findAll(): Promise<Procedure[]> {
    return this.procedureRepository.find({ 
      relations: [
        'medicalRecord',
        'medicalRecord.schedule',
        'medicalRecord.schedule.animal',
        'medicalRecord.schedule.animal.tutor',
        'medicalRecord.veterinarian'
      ]
    });
  }

  async findOne(id: number): Promise<Procedure> {
    const procedure = await this.procedureRepository.findOne({
      where: { id },
      relations: [
        'medicalRecord',
        'medicalRecord.schedule',
        'medicalRecord.schedule.animal',
        'medicalRecord.schedule.animal.tutor',
        'medicalRecord.veterinarian'
      ],
    });
    if (!procedure) {
      throw new NotFoundException(`Procedure com ID ${id} não encontrado.`);
    }
    return procedure;
  }

  async update(
    id: number,
    updateProcedureDto: UpdateProcedureDto,
  ): Promise<Procedure> {
    const procedure = await this.findOne(id);

    if (updateProcedureDto.medicalRecordId) {
      await this.medicalRecordService.findOne(
        updateProcedureDto.medicalRecordId,
      );
    }

    this.procedureRepository.merge(procedure, updateProcedureDto);
    return this.procedureRepository.save(procedure);
  }

  async remove(id: number): Promise<void> {
    const result = await this.procedureRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Procedure com ID ${id} não encontrado.`);
    }
  }
}
