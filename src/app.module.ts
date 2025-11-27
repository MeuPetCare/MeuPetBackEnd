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
      host: process.env.MYSQLHOST || process.env.DATABASE_HOST || 'db',
      port: parseInt(
        process.env.MYSQLPORT || process.env.DATABASE_PORT || '3306',
        10,
      ),
      username:
        process.env.MYSQLUSER || process.env.DATABASE_USERNAME || 'root',
      password:
        process.env.MYSQLPASSWORD || process.env.DATABASE_PASSWORD || 'root',
      database:
        process.env.MYSQLDATABASE || process.env.DATABASE_NAME || 'MeuPet',
      entities: [User, Tutor, Animal, Schedule, MedicalRecord, Procedure, Exam],
      synchronize: process.env.NODE_ENV !== 'production',
      // Remova SSL temporariamente
      ssl: false,
      // Configurações simplificadas
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
