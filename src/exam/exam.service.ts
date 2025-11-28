import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../user/user.service';
import { MedicalRecordService } from '../medicalRecord/medicalRecord.service';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    private animalService: AnimalService,
    private userService: UserService,
    private medicalRecordService: MedicalRecordService,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    // Validar que animal e veterinário existem
    await this.animalService.findOne(createExamDto.animalId);
    await this.userService.findOneById(createExamDto.veterinarianId);

    // Validar prontuário médico se fornecido
    if (createExamDto.medicalRecordId) {
      await this.medicalRecordService.findOne(createExamDto.medicalRecordId);
    }

    // Definir data atual se não fornecida
    const examData = {
      ...createExamDto,
      requestDate: createExamDto.requestDate 
        ? new Date(createExamDto.requestDate) 
        : new Date() // Usa data atual como padrão
    };

    const exam = this.examRepository.create(examData);
    return this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return this.examRepository.find({ 
      relations: ['animal', 'animal.tutor', 'veterinarian', 'medicalRecord'] 
    });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['animal', 'animal.tutor', 'veterinarian', 'medicalRecord'],
    });
    if (!exam) {
      throw new NotFoundException(`Exam com ID ${id} não encontrado.`);
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);

    if (updateExamDto.animalId) {
      await this.animalService.findOne(updateExamDto.animalId);
    }
    if (updateExamDto.veterinarianId) {
      await this.userService.findOneById(updateExamDto.veterinarianId);
    }
    if (updateExamDto.medicalRecordId) {
      await this.medicalRecordService.findOne(updateExamDto.medicalRecordId);
    }

    this.examRepository.merge(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const result = await this.examRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exam com ID ${id} não encontrado.`);
    }
  }
}
