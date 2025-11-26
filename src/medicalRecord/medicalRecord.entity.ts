import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { User } from '../user/user.entity';

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column({ unique: true })
  scheduleId: number;

  @Column({ type: 'text' })
  anamnesis: string;

  @Column({ type: 'text' })
  diagnosis: string;

  @Column({ type: 'text' })
  treatment: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'veterinarianId' })
  veterinarian: User;

  @Column()
  veterinarianId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateMedicalRecord: Date;
}
