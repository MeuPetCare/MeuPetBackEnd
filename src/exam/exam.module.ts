import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { Exam } from './exam.entity';
import { AnimalModule } from '../animal/animal.module';
import { UserModule } from '../user/user.module';
import { MedicalRecordModule } from '../medicalRecord/medicalRecord.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), AnimalModule, UserModule, MedicalRecordModule],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
