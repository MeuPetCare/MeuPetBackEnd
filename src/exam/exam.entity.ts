import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Animal } from '../animal/animal.entity';
import { User } from '../user/user.entity';
import { MedicalRecord } from '../medicalRecord/medicalRecord.entity';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'date' })
  requestDate: Date;

  @Column({ type: 'date', nullable: true })
  resultDate: Date;

  @Column({ length: 50, default: 'Solicitado' })
  status: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({ length: 255, nullable: true })
  resultUrlUrl: string; // URL para o anexo do laudo digital (MinIO/S3)

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

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.exams, { nullable: true })
  @JoinColumn({ name: 'medicalRecordId' })
  medicalRecord: MedicalRecord;

  @Column({ nullable: true })
  medicalRecordId: number;
}
