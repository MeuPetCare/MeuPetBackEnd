import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMedicalRecordIdToExam1704067300000 implements MigrationInterface {
  name = 'AddMedicalRecordIdToExam1704067300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`exam\` 
      ADD \`medicalRecordId\` int NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`exam\` 
      ADD CONSTRAINT \`FK_exam_medicalRecord\` 
      FOREIGN KEY (\`medicalRecordId\`) 
      REFERENCES \`medical_record\`(\`id\`) 
      ON DELETE SET NULL 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`exam\` 
      DROP FOREIGN KEY \`FK_exam_medicalRecord\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`exam\` 
      DROP COLUMN \`medicalRecordId\`
    `);
  }
}