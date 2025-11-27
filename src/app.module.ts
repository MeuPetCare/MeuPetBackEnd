import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Tutor } from './tutor/tutor.entity';
import { Animal } from './animal/animal.entity';
import { Schedule } from './schedule/schedule.entity';
import { MedicalRecord } from './medicalRecord/medicalRecord.entity';
import { Procedure } from './procedure/procedure.entity';
import { Exam } from './exam/exam.entity';
import { UserModule } from './user/user.module';
import { TutorModule } from './tutor/tutor.module';
import { AnimalModule } from './animal/animal.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MedicalRecordModule } from './medicalRecord/medicalRecord.module';
import { ProcedureModule } from './procedure/procedure.module';
import { ExamModule } from './exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      entities: [User, Tutor, Animal, Schedule, MedicalRecord, Procedure, Exam], // ⬅️ NÃO ESQUEÇA ISSO!
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: false,
      extra: {
        connectionLimit: 5,
      },
    }),
    AuthModule,
    TutorModule,
    AnimalModule,
    ScheduleModule,
    MedicalRecordModule,
    ProcedureModule,
    ExamModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
