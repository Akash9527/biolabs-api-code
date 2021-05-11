import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from 'modules/config';
import { AuthModule } from 'modules/public/auth';
import { CommonModule } from 'modules/common';
import { MasterModule } from 'modules/public/master';
import { UserModule } from 'modules/public/user';
import { ResidentCompanyModule } from 'modules/public/resident-company'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: process.env.POSTGRESQLCONNSTR_DB_TYPE,
          host: process.env.POSTGRESQLCONNSTR_DB_HOST,
          port: process.env.POSTGRESQLCONNSTR_DB_PORT,
          username: process.env.POSTGRESQLCONNSTR_DB_USERNAME,
          password: process.env.POSTGRESQLCONNSTR_DB_PASSWORD,
          database: process.env.POSTGRESQLCONNSTR_DB_DATABASE,
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: process.env.POSTGRESQLCONNSTR_DB_SYNC,
          ssl :  process.env.POSTGRESQLCONNSTR_DB_SSL, 
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    AuthModule,
    CommonModule,
    MasterModule,
    UserModule,
    ResidentCompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
