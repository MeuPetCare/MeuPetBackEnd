import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Animal } from '../animal/animal.entity';
import { User } from '../user/user.entity';
import { MedicalRecord } from '../medicalRecord/medicalRecord.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  dateHour: Date;

  @Column({ type: 'text' })
  reason: string;

  @Column({ length: 50, default: 'Agendada' })
  status: string;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.schedule)
  medicalRecord: MedicalRecord;

  @ManyToOne(() => Animal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animalId' })
  animal: Animal;

  @Column()
  animalId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'veterinarianId' })
  veterinarian: User;

  @Column()
  veterinarianId: number;
}
