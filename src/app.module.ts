import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TutorModule } from './tutor/tutor.module';
import { AnimalModule } from './animal/animal.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MedicalRecordModule } from './medicalRecord/medicalRecord.module';
import { ProcedureModule } from './procedure/procedure.module';
import { ExamModule } from './exam/exam.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
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
