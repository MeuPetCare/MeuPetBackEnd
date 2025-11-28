import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMustChangePasswordColumn1704067200000 implements MigrationInterface {
  name = 'AddMustChangePasswordColumn1704067200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`user\` 
      ADD COLUMN \`mustChangePassword\` tinyint NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`user\` 
      DROP COLUMN \`mustChangePassword\`
    `);
  }
}