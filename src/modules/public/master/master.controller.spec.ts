import { Test, TestingModule } from '@nestjs/testing';
import { MasterController } from './master.controller';
import { MasterModule } from './master.module';
import { MasterService } from './master.service';
import { ConfigModule } from './../../config';

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
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MasterController],
      providers: [MasterService],
      imports: [MasterModule],
    }).compile();
    masterController = app.get<MasterController>(MasterController);
  });

  describe('getUserTypes', () => {
    it('should return User Types', () => {
      expect(masterController.getUserTypes()).toBeDefined();
    });
  });
});