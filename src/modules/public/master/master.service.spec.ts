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
import { MasterPayload } from './master.payload';
import { COMPANY_STATUS } from '../../../constants/company-status';
import { USER_TYPE } from '../../../constants/user-type';
import { COMMITTEE_STATUS } from '../../../constants/committee_status';
import { of } from 'rxjs';
import { AnyCnameRecord } from 'node:dns';
const appRoot = require('app-root-path');
const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/migration.json"));

const mockMasterPayLoad: MasterPayload = {
    q: "test", pagination: true, page: 12, limit: 6, sort: true, sortFiled: "test"
    , siteIdArr: [1, 2], role: 1
}

describe('MasterService', () => {
    let masterService;
    let siteRepository;
    let roleRepository;
    let categoryRepository;
    let fundingRepository;
    let modalityRepository;
    let technologyStageRepository;
    let biolabsSourceRepository;
    let productTypeRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MasterService,

                {
                    provide: getRepositoryToken(BiolabsSource), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Category), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Funding), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Modality), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Role), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Site), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(TechnologyStage), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()

                    }
                },
                {
                    provide: getRepositoryToken(ProductType), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },

            ]
        }).compile();

        masterService = await module.get<MasterService>(MasterService);
        siteRepository = await module.get<Repository<Site>>(getRepositoryToken(Site));
        roleRepository = await module.get<Repository<Role>>(getRepositoryToken(Role));
        categoryRepository = await module.get<Repository<Category>>(getRepositoryToken(Category));
        fundingRepository = await module.get<Repository<Funding>>(getRepositoryToken(Funding));
        modalityRepository = await module.get<Repository<Modality>>(getRepositoryToken(Modality));
        technologyStageRepository = await module.get<Repository<TechnologyStage>>(getRepositoryToken(TechnologyStage));
        biolabsSourceRepository = await module.get<Repository<BiolabsSource>>(getRepositoryToken(BiolabsSource));
        productTypeRepository = await module.get<Repository<ProductType>>(getRepositoryToken(ProductType));

    });
    it('should be defined', () => {
        expect(masterService).toBeDefined();
    });


    describe('should test getCompanyStatus Functionality', () => {
        let mockCompanyStatus: Array<any> = [{ "id": 0, "name": "Applied" }, { "id": 1, "name": "Accepted" },
        { "id": 2, "name": "On Hold" }, { "id": 3, "name": "Rejected" }, { "id": 4, "name": "Graduated" }];
        it('it should return  array of company status object', async () => {
            let companyStatus = await masterService.getCompanyStatus();
            expect(companyStatus).not.toBeNull();
            expect(mockCompanyStatus.length).toBe(companyStatus.length);
            expect(companyStatus[0]).toBe(companyStatus[0]);
            expect(companyStatus[1]).toBe(companyStatus[1]);
        })
    });

    describe('should test getUserTypes Functionality', () => {
        let mockUserTypes: Array<any> = [{ "id": 0, "name": "Employee" }, { "id": 1, "name": "Scientist" },
        { "id": 2, "name": "Lab Technician" }, { "id": 3, "name": "Academic Advisor" }, { "id": 4, "name": "Investor" },
        { "id": 5, "name": "Executive" }, { "id": 6, "name": "Sponsor" }, { "id": 7, "name": "Founder" }];
        it('it should return array of user type object', async () => {
            let userTypes = await masterService.getUserTypes();;
            expect(userTypes).not.toBeNull();
            expect(mockUserTypes.length).toBe(userTypes.length);
            expect(userTypes[0]).toBe(userTypes[0]);
            expect(userTypes[1]).toBe(userTypes[1]);
        })
    });

    describe('should test getCommitteeStatus Functionality', () => {
        let mockCommiteeeStatus: Array<any> = [{ "id": 0, "name": "Unscheduled" }, { "id": 1, "name": "Scheduled" }, { "id": 2, "name": "Accepted" }, { "id": 3, "name": "Rejected" }];
        it('it should return  array of Committee status object', async () => {
            let commiteeeStatus = await masterService.getCommitteeStatus();
            expect(commiteeeStatus).not.toBeNull();
            expect(mockCommiteeeStatus.length).toBe(commiteeeStatus.length);
            expect(commiteeeStatus[0]).toBe(commiteeeStatus[0]);
            expect(commiteeeStatus[1]).toBe(commiteeeStatus[1]);
        })
    });

    describe('should test Technology Stage Functionality', () => {
        let mockTechnologyStages: Array<any> = migrationData['companyStages'];
        let mockTechnologyStage = mockTechnologyStages[0] as TechnologyStage;
        it('it should return Technology Stage object', async () => {
            jest.spyOn(technologyStageRepository, 'create').mockResolvedValueOnce(mockTechnologyStage);
            jest.spyOn(technologyStageRepository, 'save').mockResolvedValueOnce(mockTechnologyStage);
            let dbTtechnologyStage = await masterService.createTechnologyStage(mockTechnologyStage.name, mockTechnologyStage.id);
            expect(dbTtechnologyStage).not.toBeNull();
            expect(dbTtechnologyStage).toBe(dbTtechnologyStage);
            expect(dbTtechnologyStage).toMatchObject(dbTtechnologyStage);
        });

        describe('should test getTechnologyStages Functionality', () => {
            it('it should return array of technology stages object', async () => {
                jest.spyOn(technologyStageRepository, 'find').mockResolvedValueOnce(mockTechnologyStages);
                let technologyStages = await masterService.getTechnologyStages(mockMasterPayLoad);
                expect(technologyStages).not.toBeNull();
                expect(technologyStages.length).toBe(mockTechnologyStages.length);
                expect(technologyStages[0]).toBe(mockTechnologyStages[0]);
                expect(technologyStages[1]).toBe(mockTechnologyStages[1]);
                expect(technologyStages).toBe(mockTechnologyStages);
            })
        });

        it('it should return TechnologyStages object', async () => {
            let technologyStages: Array<any>= migrationData['companyStages'];
            let some ={"id":10,"name":"demo"};
            technologyStages.push(some);
            jest.spyOn(masterService, 'getTechnologyStages').mockResolvedValueOnce(technologyStages);
            if (technologyStages) {
                for (const _technologyStage of technologyStages) {
                        jest.spyOn(masterService, 'createTechnologyStage').mockResolvedValue(_technologyStage);
                  }
                let dbCategory = await masterService.createTechnologyStages();
                // console.log("dbCategory___________",dbCategory);
                // console.log("dbCategory___________",technologyStages[0]);
                // expect(dbCategory).not.toBeNull();
                // expect(dbCategory).toBe(technologyStages[0]); 
                // expect(dbCategory).toMatchObject(technologyStages[0]);
            };
        });
    });

    describe('should test modality Functionality', () => {
        let mockModalities = migrationData['modalities'];
        let mockModility = mockModalities[0] as Modality;
        it('it should return modality object', async () => {
            jest.spyOn(modalityRepository, 'create').mockResolvedValueOnce(mockModility);
            jest.spyOn(modalityRepository, 'save').mockResolvedValueOnce(mockModility);
            let dbModility = await masterService.createModality(mockModility.name, mockModility.id);
            expect(dbModility).not.toBeNull();
            expect(dbModility).toBe(mockModility);
            expect(dbModility).toMatchObject(mockModility);
        });

        it('it should return array of modalities object', async () => {
            jest.spyOn(modalityRepository, 'find').mockResolvedValueOnce(mockModalities);
            let modality = await masterService.getModalities(mockMasterPayLoad);
            expect(modality).not.toBeNull();
            expect(mockModalities.length).toBe(modality.length);
            expect(modality[0]).toBe(mockModalities[0]);
            expect(modality[1]).toBe(mockModalities[1]);
            expect(modality).toBe(mockModalities);
        });

    });

    describe('should test fundings Functionality', () => {
        let mockfundings = migrationData['fundings'];
        let mockfunding = mockfundings[0] as Funding;
        it('it should return fundings object', async () => {
            jest.spyOn(fundingRepository, 'create').mockResolvedValueOnce(mockfunding);
            jest.spyOn(fundingRepository, 'save').mockResolvedValueOnce(mockfunding);
            let dbFundings = await masterService.createFunding(mockfunding.name, mockfunding.id);
            expect(dbFundings).not.toBeNull();
            expect(dbFundings).toBe(mockfunding);
            expect(dbFundings).toMatchObject(mockfunding);
        });
        it('it should return array of fundings object', async () => {
            jest.spyOn(fundingRepository, 'find').mockResolvedValueOnce(mockfundings);
            let fundings = await masterService.getFundings(mockMasterPayLoad);
            expect(fundings).not.toBeNull();
            expect(mockfundings.length).toBe(fundings.length);
            expect(fundings[0]).toBe(fundings[0]);
            expect(fundings[1]).toBe(fundings[1]);
            expect(fundings).toBe(mockfundings);
        });
    });

    describe('should test role Functionality', () => {
        let mockRoles = migrationData['roles'];
        let mockRole = mockRoles[0] as Role;
        it('it should return role object', async () => {
            jest.spyOn(roleRepository, 'create').mockResolvedValueOnce(mockRole);
            jest.spyOn(roleRepository, 'save').mockResolvedValueOnce(mockRole);
            let dbRole = await masterService.createRole(mockRole.name, mockRole.id);
            expect(dbRole).not.toBeNull();
            expect(dbRole).toBe(mockRole);
            expect(dbRole).toMatchObject(mockRole);
        });
        it('it should return  array of getRoles', async () => {
            jest.spyOn(roleRepository, 'find').mockResolvedValueOnce(mockRoles);
            let role = await masterService.getRoles(mockMasterPayLoad);
            expect(role).not.toBeNull();
            expect(mockRoles.length).toBe(role.length);
            expect(role[0]).toBe(mockRoles[0]);
            expect(role).toBe(mockRoles);
        });

    });

    describe('should test biolabs source Functionality', () => {
        let mockbiolabsSources = migrationData['biolabsSources'];
        let mockbiolabsSource = mockbiolabsSources[0] as BiolabsSource;
        it('it should return source object', async () => {
            jest.spyOn(biolabsSourceRepository, 'create').mockResolvedValueOnce(mockbiolabsSource);
            jest.spyOn(biolabsSourceRepository, 'save').mockResolvedValueOnce(mockbiolabsSource);
            let dbBiolabsSource = await masterService.createBiolabsSource(mockbiolabsSource.name, mockbiolabsSource.id);
            expect(dbBiolabsSource).not.toBeNull();
            expect(dbBiolabsSource).toBe(mockbiolabsSource);
            expect(dbBiolabsSource).toMatchObject(mockbiolabsSource);
        });
        it('it should return array of biolabs sources object', async () => {
            jest.spyOn(biolabsSourceRepository, 'find').mockResolvedValueOnce(mockbiolabsSources);
            let dbBiolabsSource = await masterService.getBiolabsSource(mockMasterPayLoad);
            expect(dbBiolabsSource).not.toBeNull();
            expect(mockbiolabsSources.length).toBe(dbBiolabsSource.length);
            expect(dbBiolabsSource[0]).toBe(mockbiolabsSources[0]);
            expect(dbBiolabsSource[1]).toBe(mockbiolabsSources[1]);
            expect(dbBiolabsSource).toBe(mockbiolabsSources);
        });
    });

    describe('should test site Functionality', () => {
        let mockSites = migrationData['sites'];
        let mockSite = mockSites[0] as Site;
        it('it should return site object', async () => {
            jest.spyOn(siteRepository, 'create').mockResolvedValueOnce(mockSite);
            jest.spyOn(siteRepository, 'save').mockResolvedValueOnce(mockSite);
            let dbSite = await masterService.createSite(mockSite.name, mockSite.id);
            expect(dbSite).not.toBeNull();
            expect(dbSite).toBe(mockSite);
            expect(dbSite).toMatchObject(mockSite);
        });
        it('it should return   array of sites object', async () => {
            jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
            let sites = await masterService.getSites(mockMasterPayLoad);
            expect(sites).not.toBeNull();
            expect(mockSites.length).toBe(sites.length);
            expect(sites[0]).toBe(mockSites[0]);
            expect(sites).toBe(mockSites);
        });

        it('it should create sites method', async () => {
            let sites: Array<any>= migrationData['sites'];
            jest.spyOn(masterService, 'getTechnologyStages').mockResolvedValueOnce(sites);
            if (sites) {
                for (const site of sites) {
                        jest.spyOn(masterService, 'createSite').mockResolvedValue(site);
                  }
                let dbSite = await masterService.createSites();
                expect(masterService.createSite).toHaveBeenCalled();
                expect(dbSite).not.toBeNull();
            }
        });
    });


    describe('should test Category Functionality', () => {
        let mockCategories = migrationData['categories'];
        let mockCategory = mockCategories[0] as Category;
        it('it should return Category object', async () => {
            jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategory);
            jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(mockCategory);
            let dbCategory = await masterService.saveCategory(mockCategory, mockCategory.parent_id);
            expect(dbCategory).not.toBeNull();
            expect(dbCategory[0]).toBe(mockCategory[0]);
            expect(dbCategory).toMatchObject(mockCategory);
        });

        it('it should return  array of categories object', async () => {
            jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategories);
            let categories = await masterService.getCategories(mockMasterPayLoad);
            expect(categories).not.toBeNull();
            expect(mockCategories.length).toBe(categories.length);
            expect(categories[0]).toBe(mockCategories[0]);
        });

        it('it should return Categories object which will craete', async () => {
            jest.spyOn(masterService, 'createCategory').mockResolvedValueOnce(mockCategory);
            let dbCategory = await masterService.createCategories();
            expect(dbCategory).not.toBeNull();
            expect(dbCategory.length).toBe(mockCategories.length);
            expect(dbCategory[0]).toMatchObject(mockCategories[0]);
        });
        
    });

    describe('should test ProductType Functionality', () => {
        let productTypes = [];
        //let productType = migrationData["productTypeName"][0] as ProductType;
        it('it should return ProductType object', async () => {
            jest.spyOn(productTypeRepository, 'find').mockResolvedValueOnce(productTypes);
            let mockTypes = migrationData["productTypeName"];
            for (let index = 0; index < mockTypes.length; index++) {
                const productTypeMock =mockTypes[index];
                jest.spyOn(productTypeRepository, 'create').mockResolvedValueOnce(productTypeMock);
                jest.spyOn(productTypeRepository, 'save').mockResolvedValueOnce(productTypeMock);
              }
              let product = await masterService.createProductType();
             // console.log("------dbType---------------",product);
        });
    });
});
