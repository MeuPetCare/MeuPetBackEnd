import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';
import { User } from '../user/user.entity';
import { Procedure } from '../procedure/procedure.entity';
import { Exam } from '../exam/exam.entity';

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

  @OneToMany(() => Procedure, (procedure) => procedure.medicalRecord)
  procedures: Procedure[];

  @OneToMany(() => Exam, (exam) => exam.medicalRecord)
  exams: Exam[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateMedicalRecord: Date;
}
