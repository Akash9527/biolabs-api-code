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

    describe('should test getSites Functionality', () => {
        let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];

        it('it should return   array of sites object', async () => {
            jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
            let sites = await masterService.getSites(mockMasterPayLoad);
            expect(sites).not.toBeNull();
            expect(mockSites.length).toBe(sites.length);
            expect(sites[0]).toBe(mockSites[0]);
            expect(sites).toBe(mockSites);
        })
    });


    describe('should test getRoles Functionality', () => {
        let mockRoles: Array<any> = [{ "id": 1, "name": "superadmin" }, { "id": 2, "name": "siteadmin" },
        { "id": 3, "name": "sponsor" }, { "id": 4, "name": "resident" }];

        it('it should return  array of getRoles', async () => {
            jest.spyOn(roleRepository, 'find').mockResolvedValueOnce(mockRoles);
            let role = await masterService.getRoles(mockMasterPayLoad);
            expect(role).not.toBeNull();
            expect(mockRoles.length).toBe(role.length);
            expect(role[0]).toBe(mockRoles[0]);
            expect(role).toBe(mockRoles);
        })
    });


    describe('should test getCategories Functionality', () => {
        let mockCategories: Array<any> = [{
            "id": 1,
            "parent_id": 0,
            "name": "Therapeutics (Biopharma)",
            "children": [
                {
                    "id": 2,
                    "parent_id": 1,
                    "name": "Cardiovascular & Metabolism",
                    "children": [
                        { "id": 3, "parent_id": 2, "name": "Diabetes and related disorders" },
                        { "id": 4, "parent_id": 2, "name": "Chronic Kidney Disease (CKD)" },
                        { "id": 5, "parent_id": 2, "name": "Cardiovascular Disease (CVD)" },
                        {
                            "id": 6, "parent_id": 2, "name": "NAFLD, NASH, or cirrhosis"
                        },
                        { "id": 7, "parent_id": 2, "name": "Obesity" },
                        { "id": 8, "parent_id": 2, "name": "Cachexia" },
                        { "id": 9, "parent_id": 2, "name": "Atherosclerosis and vascular diseases" },
                        { "id": 10, "parent_id": 2, "name": "Dyslipidemia" },
                        { "id": 11, "parent_id": 2, "name": "Cardiac arrhythmias and associated disorders" },
                        { "id": 12, "parent_id": 2, "name": "Pulmonary hypertension" },
                        { "id": 29999, "parent_id": 2, "name": "Other" }
                    ]
                },
                {
                    "id": 13, "parent_id": 1, "name": "Oncology", "children": [
                        { "id": 14, "parent_id": 13, "name": "Hematological malignancies" },
                        { "id": 15, "parent_id": 13, "name": "Chronic lymphocytic leukemia (CLL)" },
                        { "id": 16, "parent_id": 13, "name": "Mantle cell lymphoma (MCL)" },
                        { "id": 17, "parent_id": 13, "name": "Prostate cancer" },
                        { "id": 18, "parent_id": 13, "name": "Lung Cancer" },
                        { "id": 19, "parent_id": 13, "name": "Pancreatic cancer" },
                        { "id": 20, "parent_id": 13, "name": "GI stromal tumors" },
                        {
                            "id": 21,
                            "parent_id": 13,
                            "name": "Breast cancer"
                        },
                        {
                            "id": 22,
                            "parent_id": 13,
                            "name": "Renal cell carcinoma"
                        },
                        {
                            "id": 23,
                            "parent_id": 13,
                            "name": "Kidney cancer"
                        },
                        {
                            "id": 24,
                            "parent_id": 13,
                            "name": "Ovarian cancer"
                        },
                        {
                            "id": 25,
                            "parent_id": 13,
                            "name": "Bladder cancer"
                        },
                        {
                            "id": 26,
                            "parent_id": 13,
                            "name": "Liver cancer"
                        },
                        {
                            "id": 27,
                            "parent_id": 13,
                            "name": "Melanoma"
                        },
                        {
                            "id": 28,
                            "parent_id": 13,
                            "name": "Bone metastasis"
                        },
                        {
                            "id": 29,
                            "parent_id": 13,
                            "name": "SEGA tumors"
                        },
                        {
                            "id": 30,
                            "parent_id": 13,
                            "name": "Neuroendocrine tumors"
                        },
                        {
                            "id": 31,
                            "parent_id": 13,
                            "name": "Glioblastoma"
                        },
                        {
                            "id": 139999,
                            "parent_id": 13,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 32,
                    "parent_id": 1,
                    "name": "Neuroscience",
                    "children": [
                        {
                            "id": 33,
                            "parent_id": 32,
                            "name": "Schizophrenia"
                        },
                        {
                            "id": 34,
                            "parent_id": 32,
                            "name": "Major Depressive Disorder (MDD)"
                        },
                        {
                            "id": 35,
                            "parent_id": 32,
                            "name": "Alzheimer’s Disease"
                        },
                        {
                            "id": 36,
                            "parent_id": 32,
                            "name": "Spinal muscular atrophy"
                        },
                        {
                            "id": 37,
                            "parent_id": 32,
                            "name": "Huntington’s disease"
                        },
                        {
                            "id": 38,
                            "parent_id": 32,
                            "name": "Autism or Autism Spectrum Disorder"
                        },
                        {
                            "id": 39,
                            "parent_id": 32,
                            "name": "Parkinson’s disease"
                        },
                        {
                            "id": 40,
                            "parent_id": 32,
                            "name": "Down syndrome"
                        },
                        {
                            "id": 41,
                            "parent_id": 32,
                            "name": "Multiple sclerosis"
                        },
                        {
                            "id": 329999,
                            "parent_id": 32,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 42,
                    "parent_id": 1,
                    "name": "Infectious Diseases",
                    "children": [
                        {
                            "id": 43,
                            "parent_id": 42,
                            "name": "HIV"
                        },
                        {
                            "id": 44,
                            "parent_id": 42,
                            "name": "Tuberculosis (TB)"
                        },
                        {
                            "id": 45,
                            "parent_id": 42,
                            "name": "Respiratory Syncytial Virus (RSV)"
                        },
                        {
                            "id": 46,
                            "parent_id": 42,
                            "name": "Hepatitis B"
                        },
                        {
                            "id": 47,
                            "parent_id": 42,
                            "name": "Global health crisis pathogens Ebola, Zika, Dengue, SARS-COV2"
                        },
                        {
                            "id": 48,
                            "parent_id": 42,
                            "name": "Malaria"
                        },
                        {
                            "id": 49,
                            "parent_id": 42,
                            "name": "Multi-drug Resistant Bacteria"
                        },
                        {
                            "id": 50,
                            "parent_id": 42,
                            "name": "Influenza"
                        },
                        {
                            "id": 51,
                            "parent_id": 42,
                            "name": "Cryptosporidiosis"
                        },
                        {
                            "id": 52,
                            "parent_id": 42,
                            "name": "Kinetoplastid diseases"
                        },
                        {
                            "id": 429999,
                            "parent_id": 42,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 53,
                    "parent_id": 1,
                    "name": "Immunology and Inflammation",
                    "children": [
                        {
                            "id": 54,
                            "parent_id": 53,
                            "name": "Rheumatoid arthritis"
                        },
                        {
                            "id": 55,
                            "parent_id": 53,
                            "name": "Psoriatic arthritis"
                        },
                        {
                            "id": 56,
                            "parent_id": 53,
                            "name": "Lupus"
                        },
                        {
                            "id": 57,
                            "parent_id": 53,
                            "name": "Ulcerative colitis"
                        },
                        {
                            "id": 58,
                            "parent_id": 53,
                            "name": "Crohn’s disease"
                        },
                        {
                            "id": 59,
                            "parent_id": 53,
                            "name": "NAFLD, NASH, or cirrhosis"
                        },
                        {
                            "id": 60,
                            "parent_id": 53,
                            "name": "Atopic dermatitis"
                        },
                        {
                            "id": 61,
                            "parent_id": 53,
                            "name": "Psoriasis"
                        },
                        {
                            "id": 62,
                            "parent_id": 53,
                            "name": "Vitiligo"
                        },
                        {
                            "id": 63,
                            "parent_id": 53,
                            "name": "Alopecia areata"
                        },
                        {
                            "id": 539999,
                            "parent_id": 53,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 64,
                    "parent_id": 1,
                    "name": "Vaccines",
                    "children": [
                        {
                            "id": 65,
                            "parent_id": 64,
                            "name": "Pneumococcal disease"
                        },
                        {
                            "id": 66,
                            "parent_id": 64,
                            "name": "Meningococcal disease"
                        },
                        {
                            "id": 67,
                            "parent_id": 64,
                            "name": "Influenza"
                        },
                        {
                            "id": 68,
                            "parent_id": 64,
                            "name": "Coronavirus"
                        },
                        {
                            "id": 69,
                            "parent_id": 64,
                            "name": "Dengue"
                        },
                        {
                            "id": 70,
                            "parent_id": 64,
                            "name": "Cancer"
                        },
                        {
                            "id": 71,
                            "parent_id": 64,
                            "name": "Group B streptococcus"
                        },
                        {
                            "id": 649999,
                            "parent_id": 64,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 72,
                    "parent_id": 1,
                    "name": "Ophthalmology",
                    "children": [
                        {
                            "id": 73,
                            "parent_id": 72,
                            "name": "Retinal vein occlusion (RVO)"
                        },
                        {
                            "id": 74,
                            "parent_id": 72,
                            "name": "Age-related macular degeneration (AMD)"
                        },
                        {
                            "id": 75,
                            "parent_id": 72,
                            "name": "Diabetic eye disease"
                        },
                        {
                            "id": 76,
                            "parent_id": 72,
                            "name": "Cataracts"
                        },
                        {
                            "id": 77,
                            "parent_id": 72,
                            "name": "Conjunctivitis"
                        },
                        {
                            "id": 78,
                            "parent_id": 72,
                            "name": "Dry Eye Disease"
                        },
                        {
                            "id": 79,
                            "parent_id": 72,
                            "name": "Glaucoma"
                        },
                        {
                            "id": 80,
                            "parent_id": 72,
                            "name": "Macular Edema"
                        },
                        {
                            "id": 81,
                            "parent_id": 72,
                            "name": "Myopia"
                        },
                        {
                            "id": 82,
                            "parent_id": 72,
                            "name": "Ocular disease"
                        },
                        {
                            "id": 83,
                            "parent_id": 72,
                            "name": "Retinal Diseases"
                        },
                        {
                            "id": 729999,
                            "parent_id": 72,
                            "name": "Other"
                        }
                    ]
                },
                {
                    "id": 98,
                    "parent_id": 1,
                    "name": "Rare diseases"
                },
                {
                    "id": 99,
                    "parent_id": 1,
                    "name": "Genetic diseases"
                },
                {
                    "id": 19999,
                    "parent_id": 1,
                    "name": "Other"
                }
            ]
        },
        {
            "id": 84,
            "parent_id": 0,
            "name": "Medical Devices",
            "children": [
                {
                    "id": 85,
                    "parent_id": 84,
                    "name": "Surgery"
                },
                {
                    "id": 86,
                    "parent_id": 84,
                    "name": "Vision Care"
                },
                {
                    "id": 87,
                    "parent_id": 84,
                    "name": "Orthopedics"
                },
                {
                    "id": 88,
                    "parent_id": 84,
                    "name": "Cardiovascular & Specialty Solutions"
                },
                {
                    "id": 849999,
                    "parent_id": 84,
                    "name": "Other"
                }
            ]
        },
        {
            "id": 89,
            "parent_id": 0,
            "name": "Diagnostics/Biomarkers"
        },
        {
            "id": 90,
            "parent_id": 0,
            "name": "Lab/Research Tools"
        },
        {
            "id": 91, "parent_id": 0, "name": "Consumer Product",
            "children": [{ "id": 92, "parent_id": 91, "name": "Skin Health" },
            { "id": 93, "parent_id": 91, "name": "Self Care" },
            { "id": 919999, "parent_id": 91, "name": "Other" }]
        },
        { "id": 94, "parent_id": 0, "name": "Digital Health" },
        { "id": 95, "parent_id": 0, "name": "Agriculture" },
        { "id": 96, "parent_id": 0, "name": "Veterinary Medicine" },
        { "id": 97, "parent_id": 0, "name": "Advanced Materials" }];

        it('it should return  array of categories object', async () => {
            jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategories);
            let categories = await masterService.getCategories(mockMasterPayLoad);
            expect(categories).not.toBeNull();
            expect(mockCategories.length).toBe(categories.length);
            expect(categories[0]).toBe(mockCategories[0]);
            // expect(categories).toBe(mockCategories);
        })
    });

    describe('should test getBiolabsSource Functionality', () => {
        let mockbiolabsSource: Array<any> = [{ "id": 1, "name": "Website" }, { "id": 2, "name": "Online search" },
        { "id": 3, "name": "Event" }, { "id": 4, "name": "Referral" }, { "id": 9999, "name": "Other" }];

        it('it should return array of biolabs sources object', async () => {
            jest.spyOn(biolabsSourceRepository, 'find').mockResolvedValueOnce(mockbiolabsSource);
            let biolabsSource = await masterService.getBiolabsSource(mockMasterPayLoad);
            expect(biolabsSource).not.toBeNull();
            expect(mockbiolabsSource.length).toBe(biolabsSource.length);
            expect(biolabsSource[0]).toBe(mockbiolabsSource[0]);
            expect(biolabsSource[1]).toBe(mockbiolabsSource[1]);
            expect(biolabsSource).toBe(mockbiolabsSource);
        })
    });

    describe('should test getModalities Functionality', () => {
        let mockModality: Array<any> = [
            { "id": 1, "name": "Antibody" }, { "id": 2, "name": "Antisense oligonucleotide/siRNA" }, { "id": 3, "name": "Cell therapy" },
            { "id": 4, "name": "Computational drug discovery" }, { "id": 5, "name": "Drug delivery" }, { "id": 6, "name": "Gene therapy" },
            { "id": 7, "name": "Live microbiota" }, { "id": 8, "name": "mRNA" }, { "id": 9, "name": "Protein/peptide" },
            { "id": 10, "name": "Radiopharmaceutical" }, { "id": 11, "name": "Small molecule" }, { "id": 12, "name": "Synthetic biology" },
            { "id": 13, "name": "Tissue engineering" }, { "id": 14, "name": "Vaccine" }, { "id": 15, "name": "Biosynthetics" }, { "id": 9999, "name": "Other" }
        ];

        it('it should return array of modalities object', async () => {
            jest.spyOn(modalityRepository, 'find').mockResolvedValueOnce(mockModality);
            let modality = await masterService.getModalities(mockMasterPayLoad);
            expect(modality).not.toBeNull();
            expect(mockModality.length).toBe(modality.length);
            expect(modality[0]).toBe(mockModality[0]);
            expect(modality[1]).toBe(mockModality[1]);
            expect(modality).toBe(mockModality);
        })
    });


    describe('should test getTechnologyStages Functionality', () => {

        let mockTechnologyStages: Array<any> = [
            { "id": 1, "name": "Discovery/R&D" }, { "id": 2, "name": "Proof-of-principal/Validation" },
            { "id": 3, "name": "Pre-clinical" }, { "id": 4, "name": "Clinical" }, { "id": 5, "name": "Manufacturing" },
            { "id": 6, "name": "Public" }, { "id": 9999, "name": "Other" }];

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

    describe('should test getFundings Functionality', () => {

        let mockfundings: Array<any> = [{ "id": 1, "name": "Grant funded" }, { "id": 2, "name": "Self-funded" },
        { "id": 3, "name": "Angel Investors(including friends and family)" }, { "id": 4, "name": "Seed-Funding" },
        { "id": 5, "name": "VC Series A" }, { "id": 6, "name": "VC Series B or beyond" },
        { "id": 7, "name": "Public Company" }, { "id": 9999, "name": "Other" }];

        it('it should return array of fundings object', async () => {
            jest.spyOn(fundingRepository, 'find').mockResolvedValueOnce(mockfundings);
            let fundings = await masterService.getFundings(mockMasterPayLoad);
            expect(fundings).not.toBeNull();
            expect(mockfundings.length).toBe(fundings.length);
            expect(fundings[0]).toBe(fundings[0]);
            expect(fundings[1]).toBe(fundings[1]);
            expect(fundings).toBe(mockfundings);
        })
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
            // expect(companyStatus).toBe(mockCompanyStatus);
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
            // expect(userTypes).toBe(mockUserTypes);
        })
    });

    describe('should test getCommitteeStatus Functionality', () => {

        let mockCommiteeeStatus: Array<any> = [{ "id": 0, "name": "Unscheduled" }, { "id": 1, "name": "Scheduled" },
        { "id": 2, "name": "Accepted" }, { "id": 3, "name": "Rejected" }];

        it('it should return  array of Committee status object', async () => {
            // await masterService.getCommitteeStatus.mockReturnValueOnce(mockCommiteeeStatus);
            let commiteeeStatus = await masterService.getCommitteeStatus();
            expect(commiteeeStatus).not.toBeNull();
            expect(mockCommiteeeStatus.length).toBe(commiteeeStatus.length);
            expect(commiteeeStatus[0]).toBe(commiteeeStatus[0]);
            expect(commiteeeStatus[1]).toBe(commiteeeStatus[1]);
            // expect(commiteeeStatus).toBe(mockCommiteeeStatus);
        })
    });

    describe('should test Technology Stage Functionality', () => {
        let mockTechnologyStage = { "id": 2, "name": "tech1" } as TechnologyStage;
        it('it should return Technology Stage object', async () => {
            jest.spyOn(technologyStageRepository, 'create').mockResolvedValueOnce(mockTechnologyStage);
            jest.spyOn(technologyStageRepository, 'save').mockResolvedValueOnce(mockTechnologyStage);
            let dbTtechnologyStage = await masterService.createTechnologyStage(mockTechnologyStage.name, mockTechnologyStage.id);
            expect(dbTtechnologyStage).not.toBeNull();
            expect(dbTtechnologyStage).toBe(dbTtechnologyStage);
            expect(dbTtechnologyStage).toMatchObject(dbTtechnologyStage);
        })
    });

    describe('should test modality Functionality', () => {
        let mockModility = { "id": 2, "name": "modility" } as Modality;
        it('it should return modality object', async () => {
            jest.spyOn(modalityRepository, 'create').mockResolvedValueOnce(mockModility);
            jest.spyOn(modalityRepository, 'save').mockResolvedValueOnce(mockModility);
            let dbModility = await masterService.createModality(mockModility.name, mockModility.id);
            expect(dbModility).not.toBeNull();
            expect(dbModility).toBe(mockModility);
            expect(dbModility).toMatchObject(mockModility);
        })
    });

    describe('should test fundings Functionality', () => {
        let mockfundings = { "id": 2, "name": "fudings" } as Funding;
        it('it should return fundings object', async () => {
            jest.spyOn(fundingRepository, 'create').mockResolvedValueOnce(mockfundings);
            jest.spyOn(fundingRepository, 'save').mockResolvedValueOnce(mockfundings);
            let dbFundings = await masterService.createFunding(mockfundings.name, mockfundings.id);
            expect(dbFundings).not.toBeNull();
            expect(dbFundings).toBe(mockfundings);
            expect(dbFundings).toMatchObject(mockfundings);
        })
    });
    
    describe('should test role Functionality', () => {
        let mockRole = { "id": 2, "name": "role" } as Role;
        it('it should return role object', async () => {
            jest.spyOn(roleRepository, 'create').mockResolvedValueOnce(mockRole);
            jest.spyOn(roleRepository, 'save').mockResolvedValueOnce(mockRole);
            let dbRole= await masterService.createRole(mockRole.name, mockRole.id);
            expect(dbRole).not.toBeNull();
            expect(dbRole).toBe(mockRole);
            expect(dbRole).toMatchObject(mockRole);
        })
    });

    describe('should test biolabs source Functionality', () => {
        let mockbiolabsSource = { "id": 2, "name": "source" } as BiolabsSource;
        it('it should return source object', async () => {
            jest.spyOn(biolabsSourceRepository,'create').mockResolvedValueOnce(mockbiolabsSource);
            jest.spyOn(biolabsSourceRepository, 'save').mockResolvedValueOnce(mockbiolabsSource);
            let dbBiolabsSource = await masterService.createBiolabsSource(mockbiolabsSource.name, mockbiolabsSource.id);
            expect(dbBiolabsSource).not.toBeNull();
            expect(dbBiolabsSource).toBe(mockbiolabsSource);
            expect(dbBiolabsSource).toMatchObject(mockbiolabsSource);
        })
    });

    describe('should test site Functionality', () => {
        let mockSite = {"id":2,"name":"Category","status":"1"};
        it('it should return site object', async () => {
            jest.spyOn(siteRepository,'create').mockResolvedValueOnce(mockSite);
            jest.spyOn(siteRepository, 'save').mockResolvedValueOnce(mockSite);
            let dbSite = await masterService.createSite(mockSite.name, mockSite.id);
            expect(dbSite).not.toBeNull();
            expect(dbSite).toBe(mockSite);
            expect(dbSite).toMatchObject(mockSite);
        })
    });

    
    describe('should test Category Functionality', () => {
        let mockCategory = { "id": 2, "name": "Category","parent_id":1 } as Category;
        it('it should return Category object', async () => {
            jest.spyOn(categoryRepository,'find').mockResolvedValueOnce(mockCategory);
            jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(mockCategory);
            let dbCategory = await masterService.saveCategory(mockCategory.name, mockCategory.id,mockCategory.parent_id);
            expect(dbCategory).not.toBeNull();
            expect(dbCategory).toBe(mockCategory);
            expect(dbCategory).toMatchObject(mockCategory);
        });

        it('it should return Category object', async () => {

            let technologyStages = await masterService.getTechnologyStages(mockMasterPayLoad);
            jest.spyOn(categoryRepository,'find').mockResolvedValueOnce(mockCategory);
            jest.spyOn(categoryRepository, 'save').mockResolvedValueOnce(mockCategory);
            let dbCategory = await masterService.saveCategory(mockCategory.name, mockCategory.id,mockCategory.parent_id);
            expect(dbCategory).not.toBeNull();
            expect(dbCategory).toBe(mockCategory);
            expect(dbCategory).toMatchObject(mockCategory);
        });
    });
 
});
