import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { Animal } from './animal.entity';
import { TutorModule } from '../tutor/tutor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Animal]), TutorModule],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}
