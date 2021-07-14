import { Repository } from "typeorm";
import { UserToken } from "../user/user-token.entity";
import { ResidentCompany } from "./resident-company.entity";
import { ResidentCompanyService } from "./resident-company.service";
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';
import { PassportModule } from "@nestjs/passport";
import { ResidentCompanyHistory } from "./resident-company-history.entity";
import { ResidentCompanyDocuments } from "./rc-documents.entity";
import { ResidentCompanyAdvisory } from "./rc-advisory.entity";
import { ResidentCompanyManagement } from "./rc-management.entity";
import { ResidentCompanyTechnical } from "./rc-technical.entity";
import { Site } from "../master/site.entity";
import { BiolabsSource } from "../master/biolabs-source.entity";
import { Category } from "../master/category.entity";
import { Funding } from "../master/funding.entity";
import { Modality } from "../master/modality.entity";
import { TechnologyStage } from "../master/technology-stage.entity";
import { User } from "../user/user.entity";
import { Notes } from "./rc-notes.entity";
import { Mail } from '../../../utils/Mail';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { ListResidentCompanyPayload } from './list-resident-company.payload';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';

const mockCompany: any= {id:1};
const mockAddResidentCompany: AddResidentCompanyPayload={
    name: "Biolabs",email: "elon@space.com",companyName: "tesla",site: [2,1],biolabsSources: 1,otherBiolabsSources: "",
    technology: "Tech World",rAndDPath: "Tech World",startDate: 1626134400,foundedPlace: "Tech World",companyStage: 1,
    otherCompanyStage: "",funding: "1",fundingSource: [1],otherFundingSource: "",intellectualProperty: 1,
    otherIntellectualProperty: "",isAffiliated: false,affiliatedInstitution: "",noOfFullEmp: 0,empExpect12Months: 0,
    utilizeLab: 0,expect12MonthsUtilizeLab: 0,industry: ["95"],modality: ["3"],equipmentOnsite: "Tech World",
    preferredMoveIn: 1,otherIndustries: {},otherModality: {}
   }
   const listRCPayload:ListResidentCompanyPayload={
       q:"test",role:1,pagination:true,page:3,limit:3,companyStatus:'1',committeeStatus:'1',companyVisibility:true,
       companyOnboardingStatus:true,sort:true,sortFiled:"",sortOrder:"",sortBy:""
   }
   const mockRC={
    name: "Biolabs",email: "elon@space.com",companyName: "tesla",site: [2,1],biolabsSources: 1,otherBiolabsSources: "",
    technology: "Tech World",rAndDPath: "Tech World",startDate: 1626134400,foundedPlace: "Tech World",companyStage: 1,
    otherCompanyStage: "",funding: "1",fundingSource: [1],otherFundingSource: "",intellectualProperty: 1,
    otherIntellectualProperty: "",isAffiliated: false,affiliatedInstitution: "",noOfFullEmp: 0,empExpect12Months: 0,
    utilizeLab: 0,expect12MonthsUtilizeLab: 0,industry: ["95"],modality: ["3"],equipmentOnsite: "Tech World",
    preferredMoveIn: 1,otherIndustries: {},otherModality: {}
   }
describe('ResidentCompanyService', () => {
    let residentCompanyService: ResidentCompanyService;
    let residentCompanyRepository: Repository<ResidentCompany>;
    let residentCompanyHistoryRepository:Repository<ResidentCompanyHistory>;
    let residentCompanyDocumentsRepository:Repository<ResidentCompanyDocuments>;
    let residentCompanyAdvisoryRepository:Repository<ResidentCompanyAdvisory>;
    let residentCompanyManagementRepository: Repository<ResidentCompanyManagement>;
    let residentCompanyTechnicalRepository: Repository<ResidentCompanyTechnical>;
    let siteRepository: Repository<Site>;
    let biolabsSourceRepository: Repository<BiolabsSource>;
    let categoryRepository: Repository<Category>;
    let fundingRepository: Repository<Funding>;
    let modalityRepository: Repository<Modality>;
    let technologyStageRepository: Repository<TechnologyStage>;
    let userRepository: Repository<User>;
    let notesRepository: Repository<Notes>;
   

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers:[ResidentCompanyService,Mail,
            {provide:getRepositoryToken(ResidentCompany),useValue:{
                createQueryBuilder: jest.fn(() =>
                ({
                    addSelect: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    setParameter: jest.fn().mockReturnThis(),
                    getOne: jest.fn(),
                    leftJoin:jest.fn(),
                    select:jest.fn().mockReturnThis(),
                    andWhere:jest.fn(),
                    getRawOne:jest.fn(),
                    orderBy:jest.fn(),
                    skip:jest.fn(),
                    take:jest.fn(),
                    getRawMany:jest.fn()
                })),
                find:jest.fn(),
                findOne: jest.fn(),
                create: jest.fn(() => mockRC),
                save: jest.fn(),
            }},
            {provide:getRepositoryToken(ResidentCompanyHistory),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(ResidentCompanyAdvisory),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(ResidentCompanyDocuments),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(ResidentCompanyManagement),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(ResidentCompanyTechnical),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(Site),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(BiolabsSource),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(Category),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(Funding),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(Modality),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(TechnologyStage),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(User),useValue:{find:jest.fn()}},
            {provide:getRepositoryToken(Notes),useValue:{find:jest.fn()}},
            {provide:Notes,useValue:{}},
            ],
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
           
        }).compile();

        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
        residentCompanyRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
         residentCompanyHistoryRepository=await module.get<Repository<ResidentCompanyHistory>>(getRepositoryToken(ResidentCompanyHistory));
         residentCompanyDocumentsRepository=await module.get<Repository<ResidentCompanyDocuments>>(getRepositoryToken(ResidentCompanyDocuments));
         residentCompanyAdvisoryRepository=await module.get<Repository<ResidentCompanyAdvisory>>(getRepositoryToken(ResidentCompanyAdvisory));
         residentCompanyManagementRepository=await module.get<Repository<ResidentCompanyManagement>>(getRepositoryToken(ResidentCompanyManagement));
         residentCompanyTechnicalRepository=await module.get<Repository<ResidentCompanyTechnical>>(getRepositoryToken(ResidentCompanyTechnical));
         siteRepository=await module.get<Repository<Site>>(getRepositoryToken(Site));
         biolabsSourceRepository=await module.get<Repository<BiolabsSource>>(getRepositoryToken(BiolabsSource));
         categoryRepository=await module.get<Repository<Category>>(getRepositoryToken(Category));
         fundingRepository=await module.get<Repository<Funding>>(getRepositoryToken(Funding));
         modalityRepository=await module.get<Repository<Modality>>(getRepositoryToken(Modality));
         technologyStageRepository=await module.get<Repository<TechnologyStage>>(getRepositoryToken(TechnologyStage));
         userRepository=await module.get<Repository<User>>(getRepositoryToken(User));
         notesRepository=await module.get<Repository<Notes>>(getRepositoryToken(Notes));

    });
    
    it('it should be defined', () => {
        expect(residentCompanyService).toBeDefined();
    });

    describe('Create method', () => {
       
        // it('it should called getByEmail  method ', async () => {
        //     residentCompanyRepository.createQueryBuilder('resident-companies')
        //     .where('resident-companies.email = :mockAddResidentCompany.email')
        //     .setParameter('email', mockAddResidentCompany.email)
        //     .getOne();
        //     // jest.spyOn(residentCompanyRepository, 'create').mockReturnValueOnce(mockAddResidentCompany);
        //     jest.spyOn(residentCompanyRepository, 'save').mockResolvedValueOnce(mockRC);
        //     let ans = await residentCompanyService.create(mockAddResidentCompany);
        //     expect(ans).toBe(mockRC);
        // })
        it('should not create user if email already exist', async () => {
            jest.spyOn(residentCompanyService, 'getByEmail').mockRejectedValueOnce(new NotAcceptableException("User with provided email already created."));
            try {
                await residentCompanyService.create(mockAddResidentCompany);
            } catch (e) {
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.response.message).toBe("User with provided email already created.")
            }
        });
    });
 
    describe('getResidentCompanies method', () => {
       let siteIdArr:Array<any>=[1,2]
       let mockRecidentCompanies: Array<any>=[{
        name: "Biolabs",email: "elon@space.com",companyName: "tesla",site: [2,1],biolabsSources: 1,otherBiolabsSources: "",
        technology: "Tech World",rAndDPath: "Tech World",startDate: 1626134400,foundedPlace: "Tech World",companyStage: 1,
        otherCompanyStage: "",funding: "1",fundingSource: [1],otherFundingSource: "",intellectualProperty: 1,
        otherIntellectualProperty: "",isAffiliated: false,affiliatedInstitution: "",noOfFullEmp: 0,empExpect12Months: 0,
        utilizeLab: 0,expect12MonthsUtilizeLab: 0,industry: ["95"],modality: ["3"],equipmentOnsite: "Tech World",
        preferredMoveIn: 1,otherIndustries: {},otherModality: {}
       }]
        it('it should return array of Resident companies', async () => {
            let rcQuery = await residentCompanyRepository.createQueryBuilder("resident_companies")
      .select("resident_companies.* ")
      .addSelect("s.name", "siteName")
      .addSelect("s.id", "siteId")
      .leftJoin('sites', 's', 's.id = Any(resident_companies.site)')
      .where("resident_companies.status IN (:...status)", { status: [1, 0] });

    if (siteIdArr && siteIdArr.length) {
      rcQuery.andWhere("resident_companies.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
    }
    if (listRCPayload.q && listRCPayload.q != '') {
      rcQuery.andWhere("(resident_companies.companyName LIKE :name) ", { name: `%${listRCPayload.q}%` });
    }
    if (listRCPayload.companyStatus && listRCPayload.companyStatus.length > 0) {
      rcQuery.andWhere("resident_companies.companyStatus = :companyStatus", { companyStatus: listRCPayload.companyStatus });
    }
    if (typeof listRCPayload.companyVisibility !== 'undefined') {
      rcQuery.andWhere("resident_companies.companyVisibility = :companyVisibility", { companyVisibility: listRCPayload.companyVisibility });
    }
    if (typeof listRCPayload.companyOnboardingStatus !== 'undefined') {
      rcQuery.andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: listRCPayload.companyOnboardingStatus });
    }
    if (typeof listRCPayload.committeeStatus !== 'undefined') {
      rcQuery.andWhere("resident_companies.committeeStatus = :committeeStatus", { committeeStatus: listRCPayload.committeeStatus });
    }

    if (typeof listRCPayload.sortBy !== 'undefined') {
      if (listRCPayload.sortBy == 'alpha') {
        rcQuery.orderBy("resident_companies.companyName", "ASC");
      }
      if (listRCPayload.sortBy == 'date') {
        rcQuery.orderBy("resident_companies.companyStatusChangeDate", "DESC");
      }
    } else {
      rcQuery.orderBy("id", "DESC");
    }
    if (listRCPayload.pagination) {
      let skip = 0;
      let take = 10;
      if (listRCPayload.limit) {
        take = listRCPayload.limit;
        if (listRCPayload.page) {
          skip = listRCPayload.page * listRCPayload.limit;
        }
      }
      rcQuery.skip(skip).take(take)
    }

    await rcQuery.getRawMany()
    let result=await residentCompanyService.getResidentCompanies(listRCPayload,siteIdArr)
            expect(result).toBe(mockRecidentCompanies);
        })
    });

    describe('getResidentCompaniesBkp method', () => {
      let siteIdArr:Array<any>=[1,2]
      let mockRecidentCompanies: Array<any>=[{
       name: "Biolabs",email: "elon@space.com",companyName: "tesla",site: [2,1],biolabsSources: 1,otherBiolabsSources: "",
       technology: "Tech World",rAndDPath: "Tech World",startDate: 1626134400,foundedPlace: "Tech World",companyStage: 1,
       otherCompanyStage: "",funding: "1",fundingSource: [1],otherFundingSource: "",intellectualProperty: 1,
       otherIntellectualProperty: "",isAffiliated: false,affiliatedInstitution: "",noOfFullEmp: 0,empExpect12Months: 0,
       utilizeLab: 0,expect12MonthsUtilizeLab: 0,industry: ["95"],modality: ["3"],equipmentOnsite: "Tech World",
       preferredMoveIn: 1,otherIndustries: {},otherModality: {}
      }]
       it('should return array of Resident companies', async () => {
        jest.spyOn(residentCompanyRepository, 'find').mockResolvedValueOnce(mockRecidentCompanies);
        let result=await residentCompanyService.getResidentCompaniesBkp(listRCPayload)
           expect(result).toBe(mockRecidentCompanies);
       })
   });

   describe('getResidentCompanyForSponsor method', () => {
    let siteIdArr:Array<any>=[1,2]
    let mockRecidentCompanies: Array<any>=[{
     name: "Biolabs",email: "elon@space.com",companyName: "tesla",site: [2,1],biolabsSources: 1,otherBiolabsSources: "",
     technology: "Tech World",rAndDPath: "Tech World",startDate: 1626134400,foundedPlace: "Tech World",companyStage: 1,
     otherCompanyStage: "",funding: "1",fundingSource: [1],otherFundingSource: "",intellectualProperty: 1,
     otherIntellectualProperty: "",isAffiliated: false,affiliatedInstitution: "",noOfFullEmp: 0,empExpect12Months: 0,
     utilizeLab: 0,expect12MonthsUtilizeLab: 0,industry: ["95"],modality: ["3"],equipmentOnsite: "Tech World",
     preferredMoveIn: 1,otherIndustries: {},otherModality: {}
    }]
     it('should return array of Resident companies for Sponser', async () => {
      // jest.spyOn(residentCompanyRepository, 'find').mockResolvedValueOnce(mockRecidentCompanies);
      let result=await residentCompanyService.getResidentCompanyForSponsor()
         expect(result).toBe(mockRecidentCompanies);
     })
 });

 describe('getRcSites method', () => {
  let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];
   it('should return array of Resident companies Sites', async () => {
    jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
    let result=await residentCompanyService.getRcSites(mockAddResidentCompany.site)
       expect(result).toBe(mockSites);
   })
});

describe('getRcCategories method', () => {
  let mockCategories: Array<any> = [{"id": 1,"parent_id": 0,"name": "Therapeutics (Biopharma)","status":"1","createdAt":"2021-07-08 13:24:22.972671"},
  {"id": 2,"parent_id": 1,"name": "Cardiovascular & Metabolism","status":"1","createdAt":"2021-07-08 13:24:23.083412"}];
   it('should return array of categories', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategories);
    let result=await residentCompanyService.getRcCategories([1,2])
       expect(result).toBe(mockCategories);
   })
});

describe('getRcFundings method', () => {
  let mockFundings: Array<any> = [{"id": 1,"name": "Grant funded","status":"1","createdAt":"2021-07-08 13:24:22.972671"},
  {"id": 2,"name": "Self-funded","status":"1","createdAt":"2021-07-08 13:24:23.083412"}];
   it('should return array of fundings', async () => {
    jest.spyOn(fundingRepository, 'find').mockResolvedValueOnce(mockFundings);
    let result=await residentCompanyService.getRcFundings([1,2])
       expect(result).toBe(mockFundings);
   })
});

describe('getRcTechnologyStages method', () => {
  let mockTechnologyStages: Array<any> = [{"id": 1,"name": "Discovery/R&D","status":"1","createdAt":"2021-07-08 13:24:22.972671"},
  {"id": 2,"name": "Proof-of-principal/Validation","status":"1","createdAt":"2021-07-08 13:24:23.083412"}];
   it('should return array of Technology stages', async () => {
    jest.spyOn(technologyStageRepository, 'find').mockResolvedValueOnce(mockTechnologyStages);
    let result=await residentCompanyService.getRcTechnologyStages([1,2])
       expect(result).toBe(mockTechnologyStages);
   })
});


describe('getRcBiolabsSources method', () => {
  let mockRcBiolabsSources: Array<any> = [{"id": 1,"name": "Website","status":"1","createdAt":"2021-07-08 13:24:22.972671"},
  {"id": 2,"name": "Online search","status":"1","createdAt":"2021-07-08 13:24:23.083412"}];
   it('should return array of resident company biolabs sources', async () => {
    jest.spyOn(biolabsSourceRepository, 'find').mockResolvedValueOnce(mockRcBiolabsSources);
    let result=await residentCompanyService.getRcBiolabsSources([1,2])
       expect(result).toBe(mockRcBiolabsSources);
   })
});


describe('getRcModalities method', () => {
  let mockRcModalities: Array<any> = [{"id": 1,"name": "Antibody","status":"1","createdAt":"2021-07-08 13:24:22.972671"},
  {"id": 2,"name": "Antisense oligonucleotide/siRNA","status":"1","createdAt":"2021-07-08 13:24:23.083412"}];
   it('should return array of resident company modalities', async () => {
    jest.spyOn(modalityRepository, 'find').mockResolvedValueOnce(mockRcModalities);
    let result=await residentCompanyService.getRcModalities([1,2])
       expect(result).toBe(mockRcModalities);
   })
});

describe('getRcMembers method', () => {
  let mockRcMembers: Array<any> = [{"id": 1,"companyId":1,"name": "Antibody","title":"Test","email":"test@biolabs.in","phone":"999999999","linkedinLink":"testlink.in","status":"0"}];
   it('should return array of resident company Members', async () => {
    jest.spyOn(residentCompanyManagementRepository, 'find').mockResolvedValueOnce(mockRcMembers);
    let result=await residentCompanyService.getRcModalities(1)
       expect(result).toBe(mockRcMembers);
   })
});

describe('getRcAdvisors method', () => {
  let mockRcAdvisors: Array<any> = [{"id": 1,"companyId":1,"name": "TestName","title":"Test1","organization":"biolabs","status":"1","createdAt":"2021-07-08 13:24:22.972671"}];
   it('should return array of resident company Advisors', async () => {
    jest.spyOn(residentCompanyAdvisoryRepository, 'find').mockResolvedValueOnce(mockRcAdvisors);
    let result=await residentCompanyService.getRcModalities(1)
       expect(result).toBe(mockRcAdvisors);
   })
});

describe('getRcTechnicalTeams method', () => {
  let mockRcTechnicalTeams: Array<any> = [{"id": 1,"companyId":1,"name": "TestName","title":"Test1","email":"test1@biolabs.in","phone":"9999955555","linkedinLink":"testlink1.in","status":"0"}];
   it('should return array of resident company Technical teams', async () => {
    jest.spyOn(residentCompanyTechnicalRepository, 'find').mockResolvedValueOnce(mockRcTechnicalTeams);
    let result=await residentCompanyService.getRcModalities(1)
       expect(result).toBe(mockRcTechnicalTeams);
   })
});
});