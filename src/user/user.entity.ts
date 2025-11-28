import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  crmv: string;

  @Column({ nullable: true })
  specialty: string;

  @Column('json')
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  mustChangePassword: boolean;
}
