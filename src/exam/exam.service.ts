import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    private animalService: AnimalService,
    private userService: UserService,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    await this.animalService.findOne(createExamDto.animalId);
    await this.userService.findOneById(createExamDto.veterinarianId);

    const exam = this.examRepository.create(createExamDto);
    return this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return this.examRepository.find({ relations: ['animal', 'veterinarian'] });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['animal', 'veterinarian'],
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
