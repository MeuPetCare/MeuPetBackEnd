import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { Animal } from './animal.entity';
import { TutorModule } from '../tutor/tutor.module';
import { Schedule } from '../schedule/schedule.entity';
import { MedicalRecord } from '../medicalRecord/medicalRecord.entity';
import { Exam } from '../exam/exam.entity';
import { Procedure } from '../procedure/procedure.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Animal,
      Schedule,
      MedicalRecord,
      Exam,
      Procedure,
    ]),
    TutorModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}
