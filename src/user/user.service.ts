import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'passwordHash',
        'fullName',
        'phone',
        'crmv',
        'specialty',
        'roles',
        'isActive',
      ],
    });
  }

  async createAdmin(dto: CreateAdminDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com esse e-mail.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone,
      crmv: null,
      specialty: null,
      roles: ['admin'],
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async createVeterinarian(dto: CreateVeterinarianDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com esse e-mail.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone,
      crmv: dto.crmv,
      specialty: dto.specialty,
      roles: ['veterinarian'],
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async update(id: number, partial: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);

    if ((partial as any).password) {
      throw new BadRequestException();
    }

    this.usersRepository.merge(user, partial);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com esse e-mail.',
      );
    }

    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }
}
