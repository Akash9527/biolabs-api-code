import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from '../order/model/product-type.entity';
import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { MasterService } from "./master.service";
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';
describe('MasterService', () => {
    let masterService;
    
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MasterService,

                { provide: getRepositoryToken(BiolabsSource), useValue: {} },
                { provide: getRepositoryToken(Category), useValue: {} },
                { provide: getRepositoryToken(Funding), useValue: {} },
                { provide: getRepositoryToken(Modality), useValue: {} },
                { provide: getRepositoryToken(Role), useValue: {} },
                { provide: getRepositoryToken(Site), useValue: {} },
                { provide: getRepositoryToken(TechnologyStage), useValue: {} },
                { provide: getRepositoryToken(ProductType), useValue: {} }
            ]
        }).compile();

        masterService = await module.get<MasterService>(MasterService);

    });
    it('should be defined', () => {
        expect(masterService).toBeDefined();
    });
});
