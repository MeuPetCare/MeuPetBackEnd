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

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    private scheduleService: ScheduleService,
    private userService: UserService,
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const findSchedule = await this.scheduleService.findOne(
      createMedicalRecordDto.scheduleId,
    );

    const findVet = await this.userService.findOneById(
      createMedicalRecordDto.veterinarianId,
    );

    const existingMedicalRecord = await this.medicalRecordRepository.findOne({
      where: { scheduleId: createMedicalRecordDto.scheduleId },
    });

    if (existingMedicalRecord) {
      throw new BadRequestException(
        `Já existe um medicalRecord registrado para a schedule ID ${createMedicalRecordDto.scheduleId}.`,
      );
    }

    if (findSchedule && findVet) {
      const medicalRecord =
        this.medicalRecordRepository.create(createMedicalRecordDto);
      return this.medicalRecordRepository.save(medicalRecord);
    }
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
