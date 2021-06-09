import { Test, TestingModule } from "@nestjs/testing";
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
});