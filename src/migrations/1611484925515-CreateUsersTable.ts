import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1611484925515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.users
      (
          id integer NOT NULL,
          "firstName" character varying(255) NOT NULL,
          "lastName" character varying(255) NOT NULL,
          email character varying(255) NOT NULL,
          password character varying(255) NOT NULL,
          PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
