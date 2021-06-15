/*import { Test, TestingModule } from "@nestjs/testing";
import { MasterController } from "./master.controller";
import { MasterService } from "./master.service";

const mockMasterService = () => ({
});

describe('MasterController', () => {

    let masterController;
    let masterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MasterController],
            providers: [
                { provide: MasterService, useFactory: mockMasterService },
            ]
            }).compile();
        masterController = await module.get<MasterController>(MasterController);
        masterService = await module.get<MasterService>(MasterService);

    });

    it('should be defined', () => {
        expect(masterController).toBeDefined();
    });
});*/

import { Test, TestingModule } from '@nestjs/testing';
import { MasterService } from "./master.service";

describe('MasterService', () => {
  let service: MasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterService],
    }).compile();

    service = module.get<MasterService>(MasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});