import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { MasterController } from './master.controller';
// import { MasterModule } from './master.module';
import { MasterService } from './master.service';
// import { ConfigModule } from './../../config';

import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';

describe('MasterController', () => {
  let app: TestingModule;
  let masterController: MasterController; 
  let masterService: MasterService; 
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MasterController],
      providers: [MasterService],
      imports:[TypeOrmModule.forRootAsync({
        useFactory: () => {
          return {
            type: process.env.POSTGRESQLCONNSTR_DB_TYPE,
            host: process.env.POSTGRESQLCONNSTR_DB_HOST,
            port: process.env.POSTGRESQLCONNSTR_DB_PORT,
            username: process.env.POSTGRESQLCONNSTR_DB_USERNAME,
            password: process.env.POSTGRESQLCONNSTR_DB_PASSWORD,
            database: process.env.POSTGRESQLCONNSTR_DB_DATABASE,
            entities: [__dirname + './../**/**.entity{.ts,.js}'],
            synchronize: process.env.POSTGRESQLCONNSTR_DB_SYNC,
            ssl : (process.env.POSTGRESQLCONNSTR_DB_SSL == 'true'), 
          } as TypeOrmModuleAsyncOptions;
        },
      }), TypeOrmModule.forFeature([BiolabsSource, Category, Funding, Modality, Role, Site, TechnologyStage])]
    }).compile();
    masterController = app.get<MasterController>(MasterController);
    masterService = app.get<MasterService>(MasterService);
  });

  // beforeEach(() => {
  //   jest.setTimeout(10000);
  // });

  // afterEach(() => {
  //   jest.resetAllMocks();
  // });

  describe('getUserTypes', () => {
    it('should return User Types', () => {
      expect(masterController.getUserTypes()).toBeDefined();
    });
  });
});