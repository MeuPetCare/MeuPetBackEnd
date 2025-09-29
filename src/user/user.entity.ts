import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) email: string;

  @Column() passwordHash: string;

  @Column() fullName: string;

  @Column({ nullable: true }) phone: string;

  @Column({ unique: true, nullable: true }) crmv: string;

  @Column({ nullable: true }) specialty: string;

  @Column('json') roles: string[];

  @Column({ default: true }) isActive: boolean;
}
