import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from './animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { TutorService } from '../tutor/tutor.service';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
    private tutorService: TutorService,
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

  async remove(id: number): Promise<void> {
    const result = await this.animalRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Animal com ID ${id} não encontrado.`);
    }
  }
}
