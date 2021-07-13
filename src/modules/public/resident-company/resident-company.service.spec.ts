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
// const mockAddResidentCompany: AddResidentCompanyPayload={
//     email:"",name:"",companyName:"",site:[1,2],biolabsSources:null,otherBiolabsSources:null,technology:"",rAndDPath:"",startDate:null,
//     foundedPlace:null,companyStage:null,funding:"1",fundingSource:[1,2],intellectualProperty:1,
// }

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
            {provide:getRepositoryToken(ResidentCompany),useValue:{}},
            {provide:getRepositoryToken(ResidentCompanyHistory),useValue:{}},
            {provide:getRepositoryToken(ResidentCompanyAdvisory),useValue:{}},
            {provide:getRepositoryToken(ResidentCompanyDocuments),useValue:{}},
            {provide:getRepositoryToken(ResidentCompanyManagement),useValue:{}},
            {provide:getRepositoryToken(ResidentCompanyTechnical),useValue:{}},
            {provide:getRepositoryToken(Site),useValue:{}},
            {provide:getRepositoryToken(BiolabsSource),useValue:{}},
            {provide:getRepositoryToken(Category),useValue:{}},
            {provide:getRepositoryToken(Funding),useValue:{}},
            {provide:getRepositoryToken(Modality),useValue:{}},
            {provide:getRepositoryToken(TechnologyStage),useValue:{}},
            {provide:getRepositoryToken(User),useValue:{}},
            {provide:getRepositoryToken(Notes),useValue:{}},
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

    // describe('get method', () => {
    //     it('it should called findOne  method ', async () => {
    //         jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockCompany);
    //         expect(await residentCompanyService.get(mockCompany.id)).toEqual(mockCompany);
    //     });
    // });
 
});