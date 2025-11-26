import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Animal } from './animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { TutorService } from '../tutor/tutor.service';
import { Schedule } from '../schedule/schedule.entity';
import { MedicalRecord } from '../medicalRecord/medicalRecord.entity';
import { Exam } from '../exam/exam.entity';
import { Procedure } from '../procedure/procedure.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    private readonly tutorService: TutorService,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(Procedure)
    private readonly procedureRepository: Repository<Procedure>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    await this.tutorService.findOne(createAnimalDto.tutorId);

    const animal = this.animalRepository.create(createAnimalDto);
    return this.animalRepository.save(animal);
  }

  async findAll(): Promise<Animal[]> {
    return this.animalRepository.find({ relations: ['tutor'] });
  }

  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepository.findOne({
      where: { id },
      relations: ['tutor'],
    });
    if (!animal) {
      throw new NotFoundException(`Animal com ID ${id} não encontrado.`);
    }
    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);

    if (updateAnimalDto.tutorId) {
      await this.tutorService.findOne(updateAnimalDto.tutorId);
    }

    this.animalRepository.merge(animal, updateAnimalDto);
    return this.animalRepository.save(animal);
  }

  async getHistory(animalId: number) {
    const animal = await this.findOne(animalId);

    const schedules = await this.scheduleRepository.find({
      where: { animalId },
      relations: ['veterinarian'],
    });

    const scheduleIds = schedules.map((s) => s.id);
    const medicalRecords = scheduleIds.length
      ? await this.medicalRecordRepository.find({
          where: { scheduleId: In(scheduleIds) },
          relations: ['schedule', 'veterinarian'],
        })
      : [];

    const medicalRecordIds = medicalRecords.map((mr) => mr.id);
    const procedures = medicalRecordIds.length
      ? await this.procedureRepository.find({
          where: { medicalRecordId: In(medicalRecordIds) },
        })
      : [];

    const exams = await this.examRepository.find({
      where: { animalId },
      relations: ['veterinarian'],
    });

    return {
      animal,
      schedules,
      medicalRecords,
      exams,
      procedures,
    };
  }

  async remove(id: number): Promise<void> {
    const result = await this.animalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal com ID ${id} não encontrado.`);
    }
  }
}
