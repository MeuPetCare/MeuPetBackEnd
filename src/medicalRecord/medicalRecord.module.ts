import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordService } from './medicalRecord.service';
import { MedicalRecordController } from './medicalRecord.controller';
import { MedicalRecord } from './medicalRecord.entity';
import { ScheduleModule } from '../schedule/schedule.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord]),
    ScheduleModule,
    UserModule,
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
