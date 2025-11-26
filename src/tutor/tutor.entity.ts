import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Animal } from '../animal/animal.entity';

@Entity()
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 14, unique: true })
  cpf: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @OneToMany(() => Animal, (animal) => animal.tutor)
  animal: Animal[];
}
