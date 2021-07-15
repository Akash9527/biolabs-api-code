import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1611484925515 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "status_enum" AS ENUM(\'-1\',\'0\',\'1\',\'2\',\'3\',\'4\',\'96\',\'97\',\'98\',\'99\');
      CREATE TABLE public.master_user_type
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_user_type_pkey PRIMARY KEY (id)
      );

      CREATE TABLE public.master_category
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_category_pkey PRIMARY KEY (id)
      );
      
      CREATE TABLE public.master_modality
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_modality_pkey PRIMARY KEY (id)
      );
      
      CREATE TABLE public.master_funding
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_funding_pkey PRIMARY KEY (id)
      );
      
      CREATE TABLE public.master_technology_stage
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_technology_stage_pkey PRIMARY KEY (id)
      );
      
      CREATE TABLE public.master_source_to_biolabs
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT master_source_to_biolabs_pkey PRIMARY KEY (id)
      );
      
      CREATE TABLE public.site
      (
          id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
          name character varying(250) COLLATE pg_catalog."default" NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          CONSTRAINT site_pkey PRIMARY KEY (id)
      );

      CREATE TABLE public.users
      (
          id integer NOT NULL,
          user_type character varying(255) NOT NULL,
          site_id character varying(255) NOT NULL,
          username character varying(255) NOT NULL,
          password character varying(255) NOT NULL,
          status status_enum DEFAULT '0'::status_enum,
          added_by integer DEFAULT 0,
          added_at date,
          updated_by integer DEFAULT 0,
          updated_at date,
          PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS master_user_type;`);
    await queryRunner.query(`DROP TABLE IF EXISTS master_category;`);
    await queryRunner.query(`DROP TABLE IF EXISTS master_modality;`);
    await queryRunner.query(`DROP TABLE IF EXISTS master_funding;`);
    await queryRunner.query(`DROP TABLE IF EXISTS master_technology_stage;`);
    await queryRunner.query(`DROP TABLE IF EXISTS master_source_to_biolabs;`);
    await queryRunner.query(`DROP TABLE IF EXISTS site;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
