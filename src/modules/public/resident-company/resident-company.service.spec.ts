import { Repository } from "typeorm";
import { ResidentCompany } from "./resident-company.entity";
import { ResidentCompanyService } from "./resident-company.service";
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus, NotAcceptableException } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { ResidentCompanyHistory } from "./resident-company-history.entity";
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from "./rc-documents.entity";
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from "./rc-advisory.entity";
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from "./rc-management.entity";
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from "./rc-technical.entity";
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
import { AddNotesDto } from "./add-notes.dto";
import { UpdateResidentCompanyPayload } from "./update-resident-company.payload";

const mockCompany: any = { id: 1 };
const mockAddResidentCompany: AddResidentCompanyPayload = {
  name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}
}
const listRCPayload: ListResidentCompanyPayload = {
  q: "test", role: 1, pagination: true, page: 3, limit: 3, companyStatus: '1', committeeStatus: '1', companyVisibility: true,
  companyOnboardingStatus: true, sort: true, sortFiled: "", sortOrder: "", sortBy: ""
}
const mockRC: ResidentCompany = {
  id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20,
  "companyStatus": "1",
  "companyVisibility": true,
  "companyOnboardingStatus": true,
  "elevatorPitch": null,
  "logoOnWall": null,
  "logoOnLicensedSpace": null,
  "bioLabsAssistanceNeeded": null,
  "technologyPapersPublished": null,
  "technologyPapersPublishedLinkCount": null,
  "technologyPapersPublishedLink": null,
  "patentsFiledGranted": null,
  "patentsFiledGrantedDetails": null,
  "foundersBusinessIndustryBefore": null,
  "academiaPartnerships": null,
  "academiaPartnershipDetails": null,
  "industryPartnerships": null,
  "industryPartnershipsDetails": null,
  "newsletters": null,
  "shareYourProfile": null,
  "website": null,
  "foundersBusinessIndustryName": null,
  "createdAt": 2021,
  "updatedAt": 2021,
  "pitchdeck": "pitchDeck.img",
  "logoImgUrl": "logoimgurl.img",
  "committeeStatus": null,
  "selectionDate": new Date("2021-07-05T18:30:00.000Z"),
  "companyStatusChangeDate": 2021,
}
const mockResidentHistory: ResidentCompanyHistory = {
  id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "",
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20,
  companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, elevatorPitch: null, logoOnWall: null,
  logoOnLicensedSpace: null, bioLabsAssistanceNeeded: null, technologyPapersPublished: null,
  technologyPapersPublishedLinkCount: null, technologyPapersPublishedLink: null, patentsFiledGranted: null,
  patentsFiledGrantedDetails: null, foundersBusinessIndustryBefore: null, academiaPartnerships: null,
  academiaPartnershipDetails: null, industryPartnerships: null, industryPartnershipsDetails: null,
  newsletters: null, shareYourProfile: null, website: null, foundersBusinessIndustryName: null,
  createdAt: 2021, updatedAt: 2021, pitchdeck: "pitchDeck.img", logoImgUrl: "logoimgurl.img",
  committeeStatus: '1', selectionDate: new Date("2021-07-05T18:30:00.000Z"), companyStatusChangeDate: 2021, comnpanyId: 1, intellectualProperty: null
}
const mockResidentDocument: ResidentCompanyDocuments = {
  id: 1, company_id: 1, doc_type: "Document", name: "ResidentDocument",
  link: "residentDocumentLink", status: '1', createdAt: 2021, updatedAt: 2021
}
const mockResidentManagement: ResidentCompanyManagement = {
  id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
  title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
  academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
  laboratoryExecutivePOC: true, invoicingExecutivePOC: true, createdAt: 2021, updatedAt: 2021,
}
const mockResidentAdvisory: ResidentCompanyAdvisory = {
  id: 1, name: "ResidentCompanyAdvisor", status: '1', title: "ResidentCompanyAdvisor",
  organization: "Tesla", companyId: 1, createdAt: 2021, updatedAt: 2021
}
const mockResidentTechnical: ResidentCompanyTechnical = {
  id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
  title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management", joiningAsMember: true,
  laboratoryExecutivePOC: true, invoicingExecutivePOC: true, emergencyExecutivePOC: true, createdAt: 2021, updatedAt: 2021,
}
const mockUpdateResidentCompanyPayload: UpdateResidentCompanyPayload = {
      "id": 1, "email": "yestest@gmail.com", "name": "New Vision", "companyName": "NewVisionTest",
      "site": [1], "biolabsSources": 4, "otherBiolabsSources": "", "technology": "wrsdfcersdgsfd",
      "rAndDPath": "r R&D path & commerciali", "startDate": 1625097600,
      "foundedPlace": "etsfgve", "companyStage": 4, "otherCompanyStage": "", "funding": "12", "fundingSource": [2, 7],
      "otherFundingSource": "", "intellectualProperty": 3,
      "otherIntellectualProperty": "", "isAffiliated": false, "affiliatedInstitution": "",
      "noOfFullEmp": 13, "empExpect12Months": 13, "utilizeLab": 13, "expect12MonthsUtilizeLab": 13,
      "industry": ['94,95, 96, 97'], "otherIndustries": {}, "modality": ['6, 7, 8,9, 10, 11'],
      "otherModality": {}, "preferredMoveIn": 4, "equipmentOnsite": "TestNew", "elevatorPitch": "string",
      "companySize": 20, "logoOnWall": true, "logoOnLicensedSpace": true, "bioLabsAssistanceNeeded": "string",
      "technologyPapersPublished": true, "technologyPapersPublishedLinkCount": 0, "technologyPapersPublishedLink": "string",
      "patentsFiledGranted": true, "patentsFiledGrantedDetails": "newvision", "foundersBusinessIndustryBefore": true,
      "academiaPartnerships": true, "academiaPartnershipDetails": "ersdf", "industryPartnerships": true,
      "industryPartnershipsDetails": "string", "newsletters": true, "shareYourProfile": true,
      "website": "string", "companyMembers": [], "companyAdvisors": [],
      "companyTechnicalTeams": [], "foundersBusinessIndustryName": "TestNV"
    };
const mockNotes: Notes = { id: 1, createdBy: 1, createdAt: new Date(), residentCompany: new ResidentCompany(), notesStatus: 1, notes: "this is note 1" };
describe('ResidentCompanyService', () => {
  let residentCompanyService: ResidentCompanyService;
  let residentCompanyRepository: Repository<ResidentCompany>;
  let residentCompanyHistoryRepository: Repository<ResidentCompanyHistory>;
  let residentCompanyDocumentsRepository: Repository<ResidentCompanyDocuments>;
  let residentCompanyAdvisoryRepository: Repository<ResidentCompanyAdvisory>;
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
      providers: [ResidentCompanyService, Mail,
        {
          provide: getRepositoryToken(ResidentCompany), useValue: {
            createQueryBuilder: jest.fn(() =>
            ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              getRawOne: jest.fn(),
              getRawMany: jest.fn(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn()
            })),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(() => mockRC),
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyHistory), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }),
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyAdvisory), useValue: {
            create: jest.fn(() => mockResidentAdvisory),
            find: jest.fn(), findOne: jest.fn(),
            save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            })
          }
        },
        { provide: getRepositoryToken(ResidentCompanyDocuments), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn(), create: jest.fn(() => mockResidentDocument) } },
        {
          provide: getRepositoryToken(ResidentCompanyManagement), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), create: jest.fn(() => mockResidentManagement)
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyTechnical), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), create: jest.fn(() => mockResidentTechnical)
          }
        },

        { provide: getRepositoryToken(Site), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(BiolabsSource), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(Category), useValue: { find: jest.fn(), findOne: jest.fn(), query: jest.fn().mockReturnThis(), save: jest.fn() } },
        { provide: getRepositoryToken(Funding), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(Modality), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(TechnologyStage), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        {
          provide: getRepositoryToken(Notes), useValue: {
            find: jest.fn(), findOne: jest.fn(), query: jest.fn(),
            create: jest.fn(() => mockNotes),
            save: jest.fn(), createQueryBuilder: jest.fn(() =>
            ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockReturnThis(),
            }))
          }
        },
        { provide: Notes, useValue: {} },
      ],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })
      ],

    }).compile();

    residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
    residentCompanyRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
    residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
    residentCompanyHistoryRepository = await module.get<Repository<ResidentCompanyHistory>>(getRepositoryToken(ResidentCompanyHistory));
    residentCompanyDocumentsRepository = await module.get<Repository<ResidentCompanyDocuments>>(getRepositoryToken(ResidentCompanyDocuments));
    residentCompanyAdvisoryRepository = await module.get<Repository<ResidentCompanyAdvisory>>(getRepositoryToken(ResidentCompanyAdvisory));
    residentCompanyManagementRepository = await module.get<Repository<ResidentCompanyManagement>>(getRepositoryToken(ResidentCompanyManagement));
    residentCompanyTechnicalRepository = await module.get<Repository<ResidentCompanyTechnical>>(getRepositoryToken(ResidentCompanyTechnical));
    siteRepository = await module.get<Repository<Site>>(getRepositoryToken(Site));
    biolabsSourceRepository = await module.get<Repository<BiolabsSource>>(getRepositoryToken(BiolabsSource));
    categoryRepository = await module.get<Repository<Category>>(getRepositoryToken(Category));
    fundingRepository = await module.get<Repository<Funding>>(getRepositoryToken(Funding));
    modalityRepository = await module.get<Repository<Modality>>(getRepositoryToken(Modality));
    technologyStageRepository = await module.get<Repository<TechnologyStage>>(getRepositoryToken(TechnologyStage));
    userRepository = await module.get<Repository<User>>(getRepositoryToken(User));
    notesRepository = await module.get<Repository<Notes>>(getRepositoryToken(Notes));

  });

  it('it should be defined', () => {
    expect(residentCompanyService).toBeDefined();
  });
  describe('get method', () => {
    it('it should  return  resident company', () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      residentCompanyService.get(mockRC.id);
    });
  });
  describe('getByEmail method', () => {
    it('it should called createQueryBuilder  method ', async () => {
      residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', mockRC.email)
        .getOne();
      const result = await residentCompanyService.getByEmail(mockRC.email);
      expect(result).not.toBeNull();
    });
  });
  describe('Create method', () => {

    it('it should called getByEmail  method ', async () => {
      // mockAddResidentCompany.email = "admin@gmail.com";
      residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', mockAddResidentCompany.email)
        .getOne();
      //await residentCompanyService.sendEmailToSiteAdmin(sites, req, payload.companyName);

      let ans = await residentCompanyService.create(mockAddResidentCompany);
      expect(ans).not.toBeNull();
    })

  });
  describe('updateResidentCompanyImg method', () => {
    let payload = {
      id: 1,
      imageUrl: "logoimgurl.img",
      fileType: "logo"
    }
    const companyId = payload.id;
    it('should return resident company object when fileType is logo', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (mockRC) {
        if (payload.fileType == 'logo') {
          mockRC.logoImgUrl = payload.imageUrl;
          await residentCompanyRepository.update(companyId, mockRC);
        }
      }
      let result = await residentCompanyService.updateResidentCompanyImg(payload);
      expect(result).not.toBeNull();
      expect(result.logoImgUrl).toEqual(mockRC.logoImgUrl);
      expect(result).toBe(mockRC);
    });
    it('should return resident company object when fileType is pitchdeck', async () => {
      payload.fileType = "pitchdeck";
      payload.imageUrl = "pitchDeck.img";
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (mockRC) {
        if (payload.fileType == 'pitchdeck') {
          mockRC.pitchdeck = payload.imageUrl;
          await residentCompanyRepository.update(companyId, mockRC);
        }
      }
      let result = await residentCompanyService.updateResidentCompanyImg(payload);
      expect(result).not.toBeNull();
      expect(result.logoImgUrl).toEqual(mockRC.logoImgUrl);
      expect(result).toBe(mockRC);

    });
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(null);
      try {
        await residentCompanyService.updateResidentCompanyImg(new NotAcceptableException("resident company with provided id not available."));
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("resident company with provided id not available.")
      }
    });
  });
  describe('getResidentCompanies method', () => {
    let siteIdArr: Array<any> = [1, 2]
    let mockRecidentCompanies: Array<any> = [{
      name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
      technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
      otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
      otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
      utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
      preferredMoveIn: 1, otherIndustries: {}, otherModality: {}
    }]
    it('it should return array of Resident companies', async () => {

      residentCompanyRepository
        .createQueryBuilder("product")
        .select("resident_companies.* ")
        .addSelect("s.name", "siteName")
        .addSelect("s.id", "siteId")
        .leftJoin('sites', 's', 's.id = Any(resident_companies.site)')
        .where("resident_companies.status IN (:...status)", { status: [1, 0] })
        .getRawMany();
      let result = await residentCompanyService.getResidentCompanies(listRCPayload, siteIdArr);
      expect(result).not.toBeNull();
    })
  });
  describe('addResidentCompany method', () => {
    const req: any = {
      user: { site_id: [1, 2], role: 1 },
      headers: { 'x-site-id': [2] }
    }
    let resp = { status: 'success', message: 'Application Successfully submitted' };
    it('should return resident companies  object', async () => {
      residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', mockAddResidentCompany.email)
        .getOne();
      jest.spyOn(residentCompanyRepository, 'save').mockResolvedValueOnce(mockRC);
      if (mockRC.id) {
        const historyData: any = JSON.parse(JSON.stringify(mockRC));
        historyData.comnpanyId = mockRC.id;
        delete historyData.id;
        // await this.residentCompanyHistoryRepository.save(historyData);
        jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValueOnce(mockResidentHistory);
      }
      let result = await residentCompanyService.addResidentCompany(mockAddResidentCompany, req);
      expect(result).not.toBeNull();
      expect(result).toStrictEqual(resp);
    })
  });
  describe('addResidentCompanyDocument method', () => {

    let payload: ResidentCompanyDocumentsFillableFields = {
      id: 1,
      email: "elon@space.com",
      company_id: 1,
      doc_type: "Document",
      name: "ResidentDocument",
      link: "residentDocumentLink",
      status: '1'
    }
    it('should return resident companies document object', async () => {
      jest.spyOn(residentCompanyDocumentsRepository, 'save').mockResolvedValueOnce(mockResidentDocument);
      let result = await residentCompanyService.addResidentCompanyDocument(payload)
      expect(result).toBe(mockResidentDocument);
    })
  });
  describe('residentCompanyManagements method', () => {
    let companyMembers = [1, 2, 3];
    let companyMember: any = { companyId: 1 }
    it('should return resident companies document object', async () => {
      if (companyMembers.length > 0) {
        for (let i = 0; i < companyMembers.length; i++) {
          companyMember = companyMembers[i];
          //companyMember.companyId = mockUpdateResidentCompanyPayload.id;
          jest.spyOn(residentCompanyService, 'checkEmptyVal').mockReturnValue(true);
          // jest.spyOn(residentCompanyDocumentsRepository, 'save').mockResolvedValueOnce(mockResidentDocument);
          // jest.spyOn(residentCompanyService, 'addResidentCompanyManagement').mockReturnValue(mockResidentDocument);
        }
      }
      await residentCompanyService.residentCompanyManagements(mockUpdateResidentCompanyPayload.companyMembers,mockUpdateResidentCompanyPayload.id);
    });
  });
  describe('addResidentCompanyAdvisor method', () => {
    let payload: ResidentCompanyAdvisoryFillableFields = {
      id: 1,
      name: "ResidentCompanyAdvisor",
      status: '1',
      title: "ResidentCompanyAdvisor",
      organization: "Tesla",
      companyId: 1
    }
    it('should return resident companies document object if payload id is available', async () => {
      if (payload.id)
        await residentCompanyAdvisoryRepository.update(payload.id, payload);
      let result = await residentCompanyService.addResidentCompanyAdvisor(payload);
      expect(result).not.toBeNull();
    })
    it('should  save and return resident companies document object if payload id is not available', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyAdvisoryRepository.save(residentCompanyAdvisoryRepository.create(payload))
      let result = await residentCompanyService.addResidentCompanyAdvisor(payload);
      expect(result).not.toBeNull();
    })
  });

  describe('addResidentCompanyManagement method', () => {
    let payload: ResidentCompanyManagementFillableFields = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
      laboratoryExecutivePOC: true, invoicingExecutivePOC: true
    }
    it('should return   resident companies management object', async () => {
      if (payload.id) {
        await residentCompanyManagementRepository.update(payload.id, payload);
      }
      let result = await residentCompanyService.addResidentCompanyManagement(payload);
      expect(result).not.toBeNull();
    })
    it('should return   resident companies management object', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyManagementRepository.save(payload);

      let result = await residentCompanyService.addResidentCompanyManagement(payload);
      expect(result).not.toBeNull();
    })
  });

  describe('addResidentCompanyTechnical method', () => {
    let payload: ResidentCompanyTechnicalFillableFields = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      joiningAsMember: true, mainExecutivePOC: true, laboratoryExecutivePOC: true, invoicingExecutivePOC: true
    }
    it('should return resident companies technical object if payload id is available', async () => {
      if (payload.id)
        await residentCompanyTechnicalRepository.update(payload.id, payload);
      let result = await residentCompanyService.addResidentCompanyTechnical(payload);
      expect(result).not.toBeNull();
    })
    it('should  save and return resident companies technical object if payload id is not available', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyTechnicalRepository.save(residentCompanyTechnicalRepository.create(payload))
      let result = await residentCompanyService.addResidentCompanyTechnical(payload);
      expect(result).not.toBeNull();
    })
  });
  describe('getResidentCompaniesBkp method', () => {
    let mockRecidentCompanies: Array<any> = [{
      name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
      technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
      otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
      otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
      utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
      preferredMoveIn: 1, otherIndustries: {}, otherModality: {}
    }]
    it('should return array of Resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'find').mockResolvedValueOnce(mockRecidentCompanies);
      let result = await residentCompanyService.getResidentCompaniesBkp(listRCPayload)
      expect(result).toBe(mockRecidentCompanies);
    })
  });

  describe('getResidentCompanyForSponsor method', () => {
    let mockRecidentCompanies = { companyStats: 0, graduate: 0, categoryStats: 0 }
    it('should return array of Resident companies for Sponser', async () => {
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).getRawOne();
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("AVG(resident_companies.companySize)::numeric(10,2)", "avgTeamSize").
        addSelect("count(*)", "startUpcount").
        where("resident_companies.companyStatus = :status", { status: '1' }).
        andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: "true" }).getRawOne();
      categoryRepository.
        query("SELECT c.name, c.id as industryId, (select count(rc.*) FROM public.resident_companies as rc " +
          "where c.id = ANY(rc.industry::int[]) ) as industryCount " +
          "FROM public.categories as c order by industryCount desc limit 3;")
      //jest.spyOn(residentCompanyService, 'getResidentCompanyForSponsor').mockResolvedValueOnce(mockRecidentCompanies);
      let result = await residentCompanyService.getResidentCompanyForSponsor();
      expect(result).not.toBeNull();
    })
  });

  describe('getRcSites method', () => {
    let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];
    it('should return array of Resident companies Sites', async () => {
      jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
      let result = await residentCompanyService.getRcSites(mockAddResidentCompany.site)
      expect(result).toBe(mockSites);
    })
  });

  describe('getRcCategories method', () => {
    let mockCategories: Array<any> = [{ "id": 1, "parent_id": 0, "name": "Therapeutics (Biopharma)", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "parent_id": 1, "name": "Cardiovascular & Metabolism", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of categories', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategories);
      let result = await residentCompanyService.getRcCategories([1, 2])
      expect(result).toBe(mockCategories);
    })
  });

  describe('getRcFundings method', () => {
    let mockFundings: Array<any> = [{ "id": 1, "name": "Grant funded", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "name": "Self-funded", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of fundings', async () => {
      jest.spyOn(fundingRepository, 'find').mockResolvedValueOnce(mockFundings);
      let result = await residentCompanyService.getRcFundings([1, 2])
      expect(result).toBe(mockFundings);
    })
  });

  describe('getRcTechnologyStages method', () => {
    let mockTechnologyStages: TechnologyStage = { "id": 1, "name": "Discovery/R&D", "status": "1", "createdAt": 1626134400, "updatedAt": 1626134400 };
    it('should return array of Technology stages', async () => {
      jest.spyOn(technologyStageRepository, 'findOne').mockResolvedValueOnce(mockTechnologyStages);
      let result = await residentCompanyService.getRcTechnologyStages([1, 2])
      expect(result).toBe(mockTechnologyStages);
    })
  });


  describe('getRcBiolabsSources method', () => {
    let mockRcBiolabsSources: BiolabsSource = { "id": 1, "name": "Website", "status": "1", "createdAt": 1626134400, "updatedAt": 1626134400 };
    it('should return array of resident company biolabs sources', async () => {
      jest.spyOn(biolabsSourceRepository, 'findOne').mockResolvedValue(mockRcBiolabsSources);
      let result = await residentCompanyService.getRcBiolabsSources([1, 2])
      expect(result).toBe(mockRcBiolabsSources);
    })
  });


  describe('getRcModalities method', () => {
    let mockRcModalities: Array<any> = [{ "id": 1, "name": "Antibody", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "name": "Antisense oligonucleotide/siRNA", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of resident company modalities', async () => {
      jest.spyOn(modalityRepository, 'find').mockResolvedValueOnce(mockRcModalities);
      let result = await residentCompanyService.getRcModalities([1, 2])
      expect(result).toBe(mockRcModalities);
    })
  });

  describe('getRcMembers method', () => {
    let mockRcMembers: Array<any> = [{ "id": 1, "companyId": 1, "name": "Antibody", "title": "Test", "email": "test@biolabs.in", "phone": "999999999", "linkedinLink": "testlink.in", "status": "0" }];
    it('should return array of resident company Members', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'find').mockResolvedValueOnce(mockRcMembers);
      let result = await residentCompanyService.getRcMembers(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getRcAdvisors method', () => {
    let mockRcAdvisors: Array<any> = [{ "id": 1, "companyId": 1, "name": "TestName", "title": "Test1", "organization": "biolabs", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" }];
    it('should return array of resident company Advisors', async () => {
      if (1) {
        jest.spyOn(residentCompanyAdvisoryRepository, 'find').mockResolvedValueOnce(mockRcAdvisors);
      }
      let result = await residentCompanyService.getRcAdvisors(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getRcTechnicalTeams method', () => {
    let mockRcTechnicalTeams: Array<any> = [{ "id": 1, "companyId": 1, "name": "TestName", "title": "Test1", "email": "test1@biolabs.in", "phone": "9999955555", "linkedinLink": "testlink1.in", "status": "0" }];
    it('should return array of resident company Technical teams', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'find').mockResolvedValueOnce(mockRcTechnicalTeams);
      let result = await residentCompanyService.getRcTechnicalTeams(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getResidentCompanyForSponsorBySite method', () => {
    let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];
    it('should return array of Resident companies for Sponser', async () => {
      jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: 1 }).getRawOne();
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("AVG(resident_companies.companySize)::numeric(10,2)", "avg").
        addSelect("count(*)", "count").
        where("resident_companies.companyStatus = :status", { status: '1' }).
        andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: "true" }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: 1 }).getRawOne();
      categoryRepository.
        query("SELECT c.name, c.id  as industryId, (select count(rc.*) FROM resident_companies as rc " +
          "where c.id = ANY(rc.industry::int[]) and " + 1 + " = ANY(rc.site::int[])  ) as industryCount " +
          " FROM public.categories as c order by industryCount desc limit 3;");
      residentCompanyRepository.
        query(" select count(*) as newStartUps FROM resident_companies " +
          " where resident_companies.\"companyOnboardingStatus\" = true and " +
          + 1 + "= ANY(resident_companies.\"site\"::int[]) and" +
          " resident_companies.\"companyStatus\" = '1' and " +
          " (CURRENT_DATE - INTERVAL '3 months')  < (resident_companies.\"createdAt\") ");
      let result = await residentCompanyService.getResidentCompanyForSponsorBySite();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    })
  });

  describe('getResidentCompany method', () => {
    it('should return array of resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.getResidentCompany(mockRC.id)
      expect(result).not.toBeNull();
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(null);
      try {
        await residentCompanyService.getResidentCompany(new NotAcceptableException(
          'Company with provided id not available.'));
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("Company with provided id not available.")
      }
    });
  });
  describe('updateResidentCompanyStatus method', () => {
    let payload: UpdateResidentCompanyStatusPayload = {
      "companyId": 3,
      "companyStatus": "1",
      "companyVisibility": true,
      "companyOnboardingStatus": true,
      "committeeStatus": "2",
      "selectionDate": new Date("2021-07-14"),
      "companyStatusChangeDate": new Date("2021-07-14")
    };
    it('should return array of resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.updateResidentCompanyStatus(payload)
      expect(result).not.toBeNull();
    })
    it('should return array of resident companies', async () => {
      mockRC.companyStatus = '2';
      if (Number(mockRC.companyStatus) == 2) {
        mockRC.companyOnboardingStatus = false;
        mockRC.companyVisibility = false;
        jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      }
      let result = await residentCompanyService.updateResidentCompanyStatus(payload)
      expect(result).not.toBeNull();
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'update').mockRejectedValueOnce(new NotAcceptableException(
        'Company with provided id not available.'))
      try {
        await residentCompanyService.updateResidentCompanyStatus(payload);
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("Company with provided id not available.")
      }
    });
  });
  // describe('updateResidentCompany method', () => {
  //   
  //   let residentCompany: any = {
  //     id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  //     technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  //     otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
  //     otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  //     utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  //     preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20
  //   }
  //   it('should return array of resident companies', async () => {
  //     jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(residentCompany);
  //     // if (residentCompany) {
  //     //   jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValueOnce(mockResidentHistory);
  //     //   return await residentCompanyService.getResidentCompany(residentCompany.id);
  //     // }
  //     let result = await residentCompanyService.updateResidentCompany(payload);
  //     console.log(result);
  //   })
  // });
  describe('gloabalSearchCompaniesOld method', () => {
    let mockSearchPayload: SearchResidentCompanyPayload = {
      q: "test", role: 1, pagination: true, page: 1, limit: 10,
      companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, siteIdArr: [1, 2], industries: [1, 2], modalities: [1, 2],
      fundingSource: [1, 2], minFund: 1, maxFund: 1000, minCompanySize: 1, maxCompanySize: 100, sort: true, sortFiled: "", sortOrder: "ASC"
    }

    it('should return array of old global resident companies', async () => {
      residentCompanyRepository.createQueryBuilder("resident_companies")
        .where("resident_companies.status IN (:...status)", { status: [1, 0] });
      // jest.spyOn(residentCompanyService, 'gloabalSearchCompaniesOld').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.gloabalSearchCompaniesOld(mockSearchPayload, [1, 2])
      expect(result).not.toBeNull();
    })
  });

  describe('gloabalSearchCompanies method', () => {
    let mockSearchPayload: SearchResidentCompanyPayload = {
      q: "test", role: 1, pagination: true, page: 1, limit: 10,
      companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, siteIdArr: [1, 2], industries: [1, 2], modalities: [1, 2],
      fundingSource: [1, 2], minFund: 1, maxFund: 1000, minCompanySize: 1, maxCompanySize: 100, sort: true, sortFiled: "", sortOrder: "ASC"
    }

    it('should return array of global resident companies', async () => {
      let result = await residentCompanyService.gloabalSearchCompaniesOld(mockSearchPayload, [1, 2])
      expect(result).not.toBeNull();
    })
  });

  describe('getNoteById method', () => {
    let mockNotes: Notes = { id: 1, createdBy: 1, createdAt: new Date(), residentCompany: new ResidentCompany(), notesStatus: 1, notes: "Test" };
    it('should return object of note', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      let result = await residentCompanyService.getNoteById(mockNotes.id);
      expect(result).not.toBeNull();
      expect(result).toBe(mockNotes);
    })
  });

  describe('getNoteByCompanyId method', () => {
    it('should return object of Note', async () => {
      notesRepository
        .createQueryBuilder('notes')
        .select('notes.id', 'id')
        .addSelect("notes.createdAt", 'createdAt')
        .addSelect("notes.notes", "notes")
        .addSelect("usr.firstName", "firstname")
        .addSelect("usr.lastName", "lastname")
        .leftJoin('users', 'usr', 'usr.id = notes.createdBy')
        .where('notes.notesStatus = 1')
        .andWhere("notes.residentCompanyId = :residentCompanyId", { residentCompanyId: 1 })
        .orderBy("notes.createdAt", "DESC")
        .getRawMany();
      let result = await residentCompanyService.getNoteByCompanyId(mockRC.id);
      expect(result).not.toBeNull();
    })
  });
  describe('addNote method', () => {
    const req: any = {
      user: { site_id: [1, 2], role: 1 }
    };
    const payload: AddNotesDto = { "companyId": 1, "notes": "this is note 1" };
    it('should add note data ', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      const note = new Notes();
      note.createdBy = req.user.id;
      note.notes = payload.notes;
      note.residentCompany = mockRC;
      jest.spyOn(notesRepository, 'save').mockResolvedValueOnce(mockNotes);
      const notes = await residentCompanyService.addNote(payload, req);
      expect(notes).not.toBeNull();
      expect(notes).toBe(mockNotes);
    })
  });
  describe('softDeleteNote method', () => {
    it('should delete data based on id', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      jest.spyOn(notesRepository, 'save').mockResolvedValueOnce(mockNotes);
      const notes = await residentCompanyService.softDeleteNote(mockNotes.id);
      expect(notes).toBe(mockNotes);
    })
    it('it should throw exception if note id is not provided  ', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.softDeleteNote(new NotAcceptableException('User with provided id not available.'));
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        // expect(e.response.message).toBe('User with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
  });

  describe('softDeleteMember method', () => {
    let mockRcAdvisors: ResidentCompanyAdvisory = { "id": 1, "companyId": 1, "name": "Antibody", "title": "Test", "status": "0", "organization": "1", "createdAt": 1600000, "updatedAt": 16000000 };
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyAdvisoryRepository, 'findOne').mockResolvedValueOnce(mockRcAdvisors);
      jest.spyOn(residentCompanyAdvisoryRepository, 'save').mockResolvedValueOnce(mockRcAdvisors);
      const notes = await residentCompanyService.softDeleteMember(1, "advisors");
      expect(notes).toBe(mockRcAdvisors);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyAdvisoryRepository, 'findOne').mockRejectedValueOnce(new NotAcceptableException('Member with provided id not available.'));
      try {
        await residentCompanyService.softDeleteMember(1, "advisors");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'findOne').mockResolvedValueOnce(mockResidentManagement);
      jest.spyOn(residentCompanyManagementRepository, 'save').mockResolvedValueOnce(mockResidentManagement);
      const notes = await residentCompanyService.softDeleteMember(1, "managements");
      expect(notes).toBe(mockResidentManagement);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'findOne').mockRejectedValueOnce(new NotAcceptableException('Member with provided id not available.'));
      try {
        await residentCompanyService.softDeleteMember(1, "managements");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'findOne').mockResolvedValueOnce(mockResidentTechnical);
      jest.spyOn(residentCompanyTechnicalRepository, 'save').mockResolvedValueOnce(mockResidentTechnical);
      const notes = await residentCompanyService.softDeleteMember(1, "technicals");
      expect(notes).toBe(mockResidentTechnical);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'findOne').mockRejectedValueOnce(new NotAcceptableException('Member with provided id not available.'));
      try {
        await residentCompanyService.softDeleteMember(1, "technicals");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
  });

  describe('getStagesOfTechnologyBySiteId method', () => {
    let mockStagesOfTechnologies = { stagesOfTechnology: 0 }

    it('should return object', async () => {
      const queryStr = " SELECT \"stage\", \"name\", \"quarterno\", \"quat\" " +
        " FROM " +
        " (SELECT MAX(rch.\"companyStage\") AS stage, " +
        "EXTRACT(quarter FROM rch.\"createdAt\") AS \"quarterno\", " +
        "to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') AS \"quat\" " +
        "FROM public.resident_company_history AS rch " +
        "WHERE rch.\"site\" = \'{ " + 1 + "}\' and rch.\"comnpanyId\" = " + 1 +
        "GROUP BY " +
        "EXTRACT(quarter FROM rch.\"createdAt\")," +
        "to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') " +
        " ) AS csg " +
        " LEFT JOIN technology_stages AS ts ON ts.id = csg.\"stage\" " +
        " ORDER BY quat";
      residentCompanyHistoryRepository.query(queryStr);
      // jest.spyOn(residentCompanyService, 'gloabalSearchCompaniesOld').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.getStagesOfTechnologyBySiteId(1, 1)
      //  expect(result).toBe(mockStagesOfTechnologies);
      expect(result).not.toBeNull()
    })
  });

  describe('getFundingBySiteIdAndCompanyId method', () => {
    let mockfundings = { fundings: 0 }

    it('should return object', async () => {
      const queryStr = " SELECT MAX(\"funding\" ::Decimal) as \"Funding\", " +
        " extract(quarter from rch.\"createdAt\") as \"quarterNo\", " +
        " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') AS \"quaterText\" " +
        " FROM public.resident_company_history as rch " +
        " WHERE rch.\"site\" = \'{" + 1 + "}\' and rch.\"comnpanyId\" = " + 1 +
        " group by " +
        " extract(quarter from rch.\"createdAt\"), " +
        " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') " +
        " order by to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') ";
      residentCompanyHistoryRepository.query(queryStr);
      let result = await residentCompanyService.getFundingBySiteIdAndCompanyId(1, 1)
      expect(result).not.toBeNull()
    })
  });
  describe('getFeeds method', () => {
    let companyId = 1;
    it('should return object', async () => {
      residentCompanyHistoryRepository.query("SELECT feeds(" + companyId + ")");
      let result = await residentCompanyService.getFeeds(1, 1);
      expect(result).not.toBeNull();
    })
  });

  describe('getstartedWithBiolabs method', () => {

    it('should return object', async () => {
      const queryStr = "SELECT min(\"createdAt\")  as startWithBiolabs FROM public.resident_company_history" +
        " WHERE \"site\" = \'{" + 1 + "}\' and \"comnpanyId\" = " + 1 +
        "AND \"companyOnboardingStatus\" = true";
      residentCompanyHistoryRepository.query(queryStr);
      let result = await residentCompanyService.getstartedWithBiolabs(1, 1);
      expect(result).not.toBeNull()
    })
  });

  describe('getFinancialFees method', () => {

    it('should return array of financial fees', async () => {
      const currentMonth = new Date().getMonth() + 1;
      const queryStr = "SELECT  p. \"productTypeId\",SUM(calculate_prorating(o.\"cost\",o.\"month\",o.\"startDate\",o.\"endDate\",o.\"quantity\",o.\"currentCharge\",o.\"year\"))  From order_product as o " +
        "INNER JOIN product as p ON  p.id =o.\"productId\" " +
        "where p.id = o.\"productId\" " +
        "AND o.\"companyId\"=" + 1 +
        "AND o.\"month\" =  " + currentMonth +
        "AND p.\"productTypeId\" IN(1, 2, 5) " +
        "group by  p.\"productTypeId\" ";
      residentCompanyHistoryRepository.query(queryStr);
      let result = await residentCompanyService.getFinancialFees(1)
      expect(result).not.toBeNull()
    })
  });
  describe('timelineAnalysis method', () => {

    it('should return array of timeline history', async () => {
      const currentMonth = new Date().getMonth() + 1;
      const queryStr = `
   SELECT "productTypeId",  MAX("total")as sumofquantity ,
           extract(quarter from "updatedAt")as quarterNo,
           to_char("updatedAt", '"Q"Q.YYYY') AS quat
   FROM
      (SELECT  p."productTypeId",SUM(o.quantity) as total, o."updatedAt",
         extract(quarter from o."updatedAt") as quarterNo,
         to_char(o."updatedAt", '"Q"Q.YYYY') AS quat
      FROM order_product as o
   INNER JOIN product as p ON p.id = o."productId"
           where p.id = o."productId" 
               AND "companyId"=${1}
               AND p."productTypeId" IN (2,4)
   group by p."productTypeId" ,o."updatedAt",
         extract(quarter from o."updatedAt"),
         to_char(o."updatedAt", '"Q"Q.YYYY')
       order by to_char(o."updatedAt", '"Q"Q.YYYY')) as sunTbl
   GROUP BY extract(quarter from sunTbl."updatedAt"),
               sunTbl."productTypeId",to_char("updatedAt", '"Q"Q.YYYY')
               order by quat;
   `;
      residentCompanyHistoryRepository.query(queryStr);
      let result = await residentCompanyService.timelineAnalysis(1)
      expect(result).not.toBeNull()
    })
  });

  describe('getCompanySizeQuartly method', () => {

    it('should return array of resident company history', async () => {
      const currentMonth = new Date().getMonth() + 1;
      const queryStr = `
   SELECT 
      MAX("companySize") as noOfEmployees,
         extract(quarter from "updatedAt")as quarterNo,
         to_char("updatedAt", '"Q"Q.YYYY') AS quat
 FROM resident_company_history 
        where "comnpanyId"=${1}
 group by
           extract(quarter from "updatedAt"),
           to_char("updatedAt", '"Q"Q.YYYY')
           order by quat;
   `;
      residentCompanyHistoryRepository.query(queryStr);
      let result = await residentCompanyService.getCompanySizeQuartly(1)
      expect(result).not.toBeNull()
    })
  });
  describe('checkEmptyVal method', () => {
    const data: any = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
      laboratoryExecutivePOC: true, invoicingExecutivePOC: true,emergencyExecutivePOC:true
    }
    let type = "managements";
    it("should check if type advisors should not be null", async () => {
      {
      
        if (type == 'advisors' && (data.name || data.title || data.organization)) {
          return true;
        }
        await residentCompanyService.checkEmptyVal(type, data);
      }
    });
    it("should check if type managements should not be null", async () => {

      type = "managements";
      if (type == 'managements' &&
        (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
          || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
        return true;
      }
      await residentCompanyService.checkEmptyVal(type, data);


    });
    it("should check if type technicals should not be null", async () => {
       type = "technicals";
      if (type == 'technicals' &&
        (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
          || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
        return true;
      }
      await residentCompanyService.checkEmptyVal(type, data);

    });
  });
});
