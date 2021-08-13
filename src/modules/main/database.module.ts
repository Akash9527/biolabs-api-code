import { Module } from '@nestjs/common';
import { Pool } from "pg";
import { DatabaseService } from "./database.service";


const databasePoolFactory = async () => {
    return new Pool({
        user: process.env.POSTGRESQLCONNSTR_DB_USERNAME,
        host: process.env.POSTGRESQLCONNSTR_DB_HOST,
        database: process.env.POSTGRESQLCONNSTR_DB_DATABASE,
        password: process.env.POSTGRESQLCONNSTR_DB_PASSWORD,
        port: parseInt(process.env.POSTGRESQLCONNSTR_DB_PORT),
    });
  };
  
  @Module({
    providers: [
      {
        provide: 'DATABASE_POOL',
        useFactory: databasePoolFactory,
      },
      DatabaseService,
    ],
    exports: [DatabaseService],
  })
  export class DatabaseModule {}