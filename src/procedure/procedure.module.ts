import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { Procedure } from './procedure.entity';
import { MedicalRecordModule } from '../medicalRecord/medicalRecord.module';

@Module({
  imports: [TypeOrmModule.forFeature([Procedure]), MedicalRecordModule],
  controllers: [ProcedureController],
  providers: [ProcedureService],
  exports: [ProcedureService],
})
export class ProcedureModule {}
