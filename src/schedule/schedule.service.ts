import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AnimalService } from '../animal/animal.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private animalService: AnimalService,
    private userService: UserService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    await this.animalService.findOne(createScheduleDto.animalId);
    await this.userService.findOneById(createScheduleDto.veterinarianId);

    const schedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: [
        'animal',
        'animal.tutor', // Inclui o tutor do animal
        'veterinarian',
        'medicalRecord',
        'medicalRecord.procedures',
      ],
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: [
        'animal',
        'animal.tutor', // Inclui o tutor do animal
        'veterinarian',
        'medicalRecord',
        'medicalRecord.procedures',
      ],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule com ID ${id} não encontrada.`);
    }
    return schedule;
  }

  async update(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (updateScheduleDto.animalId) {
      await this.animalService.findOne(updateScheduleDto.animalId);
    }
    if (updateScheduleDto.veterinarianId) {
      await this.userService.findOneById(updateScheduleDto.veterinarianId);
    }

    this.scheduleRepository.merge(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async cancel(id: number): Promise<Schedule> {
    const schedule = await this.findOne(id);
    schedule.status = 'Cancelada';
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule com ID ${id} não encontrada.`);
    }
  }
}
