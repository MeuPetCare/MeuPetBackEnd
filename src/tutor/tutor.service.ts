import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
  ) {}

  async create(createTutorDto: CreateTutorDto): Promise<Tutor> {
    const tutor = this.tutorRepository.create(createTutorDto);
    return this.tutorRepository.save(tutor);
  }

  async findAll(): Promise<Tutor[]> {
    return this.tutorRepository.find();
  }

  async findOne(id: number): Promise<Tutor> {
    const tutor = await this.tutorRepository.findOne({ where: { id } });
    if (!tutor) {
      throw new NotFoundException(`Tutor com ID ${id} não encontrado.`);
    }
    return tutor;
  }

  async update(id: number, updateTutorDto: UpdateTutorDto): Promise<Tutor> {
    const tutor = await this.findOne(id);
    this.tutorRepository.merge(tutor, updateTutorDto);
    return this.tutorRepository.save(tutor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tutorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tutor com ID ${id} não encontrado.`);
    }
  }
}
