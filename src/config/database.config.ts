import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Animal } from '../animal/animal.entity';
import { Schedule } from '../schedule/schedule.entity';
import { MedicalRecord } from '../medicalRecord/medicalRecord.entity';
import { Procedure } from '../procedure/procedure.entity';
import { Exam } from '../exam/exam.entity';
import { AddMustChangePasswordColumn1704067200000 } from '../migrations/1704067200000-AddMustChangePasswordColumn';
import { AddMedicalRecordIdToExam1704067300000 } from '../migrations/1704067300000-AddMedicalRecordIdToExam';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isRailway = !!(process.env.MYSQLHOST || process.env.DATABASE_URL);

  // Railway Production Configuration
  if (isProduction && isRailway) {
    // Railway provides these environment variables
    return {
      type: 'mysql',
      host: process.env.MYSQLHOST,
      port: parseInt(process.env.MYSQLPORT || '3306', 10),
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      entities: [User, Tutor, Animal, Schedule, MedicalRecord, Procedure, Exam],
      migrations: [
        AddMustChangePasswordColumn1704067200000,
        AddMedicalRecordIdToExam1704067300000
      ],
      migrationsRun: true, // Run migrations automatically
      synchronize: false, // Never use synchronize in production
      logging: false,
      ssl: {
        rejectUnauthorized: false, // Railway MySQL requires SSL
      },
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }

  // Local Development Configuration
  if (!isProduction) {
    return {
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'MeuPet',
      entities: [User, Tutor, Animal, Schedule, MedicalRecord, Procedure, Exam],
      synchronize: true, // OK for development
      logging: true, // Enable logging in development
      dropSchema: false, // Set to true if you want to reset DB on restart
    };
  }

  // Fallback for other production environments
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'MeuPet',
    entities: [User, Tutor, Animal, Schedule, MedicalRecord, Procedure, Exam],
    synchronize: false,
    logging: false,
  };
};
