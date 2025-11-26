import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './medicalRecord.entity';
import { CreateMedicalRecordDto } from './dto/create-medicalRecord.dto';
import { UpdateMedicalRecordDto } from './dto/update-medicalRecord.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { UserService } from '../user/user.service';
import { CreateScheduleDto } from '../schedule/dto/create-schedule.dto';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService,
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    await this.userService.findOneById(createMedicalRecordDto.veterinarianId);

    let scheduleId = createMedicalRecordDto.scheduleId;

    if (scheduleId) {
      await this.scheduleService.findOne(scheduleId);
      const existingMedicalRecord = await this.medicalRecordRepository.findOne({
        where: { scheduleId },
      });
      if (existingMedicalRecord) {
        throw new BadRequestException(
          `Já existe um medicalRecord registrado para a schedule ID ${scheduleId}.`,
        );
      }
    } else {
      if (!createMedicalRecordDto.animalId) {
        throw new BadRequestException(
          'Para criar um prontuário sem schedule prévia é obrigatório informar o animalId.',
        );
      }

      const createScheduleDto: CreateScheduleDto = {
        dateHour: new Date(),
        reason: 'Atendimento direto gerado a partir do prontuário.',
        animalId: createMedicalRecordDto.animalId,
        veterinarianId: createMedicalRecordDto.veterinarianId,
      };

      const autoSchedule = await this.scheduleService.create(createScheduleDto);
      scheduleId = autoSchedule.id;
    }

    const medicalRecord = this.medicalRecordRepository.create({
      scheduleId,
      anamnesis: createMedicalRecordDto.anamnesis,
      diagnosis: createMedicalRecordDto.diagnosis,
      treatment: createMedicalRecordDto.treatment,
      veterinarianId: createMedicalRecordDto.veterinarianId,
    });

    return this.medicalRecordRepository.save(medicalRecord);
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      relations: ['schedule', 'veterinarian'],
    });
  }

  async findOne(id: number): Promise<MedicalRecord> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: ['schedule', 'veterinarian'],
    });
    if (!medicalRecord) {
      throw new NotFoundException(`MedicalRecord com ID ${id} não encontrado.`);
    }
    return medicalRecord;
  }

  async update(
    id: number,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const medicalRecord = await this.findOne(id);

    if (updateMedicalRecordDto.scheduleId) {
      await this.scheduleService.findOne(updateMedicalRecordDto.scheduleId);
    }
    if (updateMedicalRecordDto.veterinarianId) {
      await this.userService.findOneById(updateMedicalRecordDto.veterinarianId);
    }

    this.medicalRecordRepository.merge(medicalRecord, updateMedicalRecordDto);
    return this.medicalRecordRepository.save(medicalRecord);
  }

  async remove(id: number): Promise<void> {
    const result = await this.medicalRecordRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`MedicalRecord com ID ${id} não encontrado.`);
    }
  }
}
