import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { AddResidentCompanyPayload } from './add-resident-company.payload';

import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from './rc-advisory.entity'
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from './rc-documents.entity'
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from './rc-management.entity'
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from './rc-technical.entity'

import { Site } from '../master/site.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Modality } from '../master/modality.entity';
import { TechnologyStage } from '../master/technology-stage.entity';

import { Request } from 'express';
import { ListResidentCompanyPayload } from './list-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';

@Injectable()
export class ResidentCompanyService {
  constructor(
    @InjectRepository(ResidentCompany)
    private readonly residentCompanyRepository: Repository<ResidentCompany>,
    @InjectRepository(ResidentCompanyAdvisory)
    private readonly residentCompanyAdvisoryRepository: Repository<ResidentCompanyAdvisory>,
    @InjectRepository(ResidentCompanyDocuments)
    private readonly residentCompanyDocumentsRepository: Repository<ResidentCompanyDocuments>,
    @InjectRepository(ResidentCompanyManagement)
    private readonly residentCompanyManagementRepository: Repository<ResidentCompanyManagement>,
    @InjectRepository(ResidentCompanyTechnical)
    private readonly residentCompanyTechnicalRepository: Repository<ResidentCompanyTechnical>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(BiolabsSource)
    private readonly biolabsSourceRepository: Repository<BiolabsSource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    @InjectRepository(Modality)
    private readonly modalityRepository: Repository<Modality>,
    @InjectRepository(TechnologyStage)
    private readonly technologyStageRepository: Repository<TechnologyStage>,
  ) { }

  /**
   * Description: This method will get the resident company by id.
   * @description This method will get the resident company by id.
   * @param id number resident company id
   * @return resident company object
   */
  async get(id: number) {
    return this.residentCompanyRepository.findOne(id);
  }

  /**
   * Description: This method will get the resident company by email.
   * @description This method will get the resident company by email.
   * @param email string resident company email
   * @return resident company object
   */
  async getByEmail(email: string) {
    return await this.residentCompanyRepository
      .createQueryBuilder('resident-companies')
      .where('resident-companies.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  /**
   * Description: This method will create the new resident companies.
   * @description This method will create the new resident companies.
   * @param payload object of AddResidentCompanyPayload.
   * @return resident companies object
   */
  async create(payload: AddResidentCompanyPayload) {
    const rc = await this.getByEmail(payload.email);

    if (rc) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return await this.residentCompanyRepository.save(this.residentCompanyRepository.create(payload));
  }

  /**
   * Description: This method will create the new resident companies advisor.
   * @description This method will create the new resident companies advisor.
   * @param payload object of ResidentCompanyAdvisoryFillableFields.
   * @return resident companies advisor object
   */
  async addResidentCompanyAdvisor(payload: ResidentCompanyAdvisoryFillableFields) {
    const savedRcAdvisor = await this.residentCompanyAdvisoryRepository.save(this.residentCompanyAdvisoryRepository.create(payload));
    return savedRcAdvisor;
  }

  /**
   * Description: This method will create the new resident companies document.
   * @description This method will create the new resident companies document.
   * @param payload object of ResidentCompanyDocumentsFillableFields.
   * @return resident companies document object
   */
  async addResidentCompanyDocument(payload: ResidentCompanyDocumentsFillableFields) {
    const savedRcDocument = await this.residentCompanyDocumentsRepository.save(this.residentCompanyDocumentsRepository.create(payload));
    return savedRcDocument;
  }

  /**
   * Description: This method will create the new resident companies management.
   * @description This method will create the new resident companies management.
   * @param payload object of ResidentCompanyManagementFillableFields.
   * @return resident companies management object
   */
  async addResidentCompanyManagement(payload: ResidentCompanyManagementFillableFields) {
    const savedRcManagement = await this.residentCompanyManagementRepository.save(this.residentCompanyManagementRepository.create(payload));
    return savedRcManagement;
  }

  /**
   * Description: This method will create the new resident companies technical.
   * @description This method will create the new resident companies technical.
   * @param payload object of ResidentCompanyTechnicalFillableFields.
   * @return resident companies technical object
   */
  async addResidentCompanyTechnical(payload: ResidentCompanyTechnicalFillableFields) {
    const savedRcTechnical = await this.residentCompanyTechnicalRepository.save(this.residentCompanyTechnicalRepository.create(payload));
    return savedRcTechnical;
  }

  /**
   * Description: This method will create the new resident companies.
   * @description This method will create the new resident companies.
   * @param payload object of AddResidentCompanyPayload.
   * @param req object of Request.
   * @return resident companies object
   */
  async addResidentCompany(payload: AddResidentCompanyPayload, req: Request) {
    const rc = await this.getByEmail(payload.email);

    if (rc) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    const newRc = await this.residentCompanyRepository.create(payload);
    const savedRc = await this.residentCompanyRepository.save(newRc);
    return savedRc;
  }

  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async getResidentCompanies(payload: ListResidentCompanyPayload) {
    let search;
    let skip;
    let take;
    let _search = {};
    if (payload.role || payload.role == 0) {
      _search = { ..._search, ...{ role: payload.role } };
    }
    if (payload.q && payload.q != "") {
      _search = { ..._search, ...{ companyName: Like("%" + payload.q + "%") } };
    }
    if (payload.companyStatus && payload.companyStatus.length > 0) {
      _search = { ..._search, ...{ companyStatus: In(payload.companyStatus) } };
    }
    if (typeof payload.companyVisibility !== 'undefined') {
      _search = { ..._search, ...{ companyVisibility: payload.companyVisibility } };
    }
    if (typeof payload.companyOnboardingStatus !== 'undefined') {
      _search = { ..._search, ...{ companyOnboardingStatus: payload.companyOnboardingStatus } };
    }
    search = [{ ..._search, status: In(['1', '0']) }]
    if (payload.pagination) {
      skip = { skip: 0 }
      take = { take: 10 }
      if (payload.limit) {
        take = { take: payload.limit };
        if (payload.page) {
          skip = { skip: payload.page * payload.limit }
        }
      }
    }
    return await this.residentCompanyRepository.find({
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will return the sites list.
   * @description This method will return the sites list.
   * @param ids number[]
   * @return array of sites object
   */
  async getRcSites(ids) {
    return await this.siteRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

  /**
   * Description: This method will return the categories list.
   * @description This method will return the categories list.
   * @param ids number[]
   * @return array of categories object
   */
  async getRcCategories(ids) {
    return await this.categoryRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

  /**
   * Description: This method will return the fundings list.
   * @description This method will return the fundings list.
   * @param ids number[]
   * @return array of fundings object
   */
  async getRcFundings(ids) {
    return await this.fundingRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  /**
   * Description: This method will return the technology stages list.
   * @description This method will return the technology stages list.
   * @param ids number[]
   * @return array of technology stages object
   */
  async getRcTechnologyStages(ids) {
    return await this.technologyStageRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  /**
   * Description: This method will return the biolabs sources list.
   * @description This method will return the biolabs sources list.
   * @param ids number[]
   * @return array of biolabs sources object
   */
  async getRcBiolabsSources(ids) {
    return await this.biolabsSourceRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  /**
   * Description: This method will return the modalities list.
   * @description This method will return the modalities list.
   * @param ids number[]
   * @return array of modalities object
   */
  async getRcModalities(ids) {
    return await this.modalityRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

  /**
   * Description: This method will get the resident company.
   * @description This method will get the resident company.
   * @param id number resident company id
   * @return resident company object
   */
  async getResidentCompany(id) {
    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: id }
    });
    if (residentCompany) {
      residentCompany.sites = await this.getRcSites(residentCompany.site);
      residentCompany.categories = await this.getRcCategories(residentCompany.industry);
      residentCompany.modalities = await this.getRcModalities(residentCompany.modality);
      residentCompany.fundingSources = await this.getRcFundings(residentCompany.fundingSource);
      residentCompany.companyStages = await this.getRcTechnologyStages(residentCompany.companyStage);
      residentCompany.biolabsSources = await this.getRcBiolabsSources(residentCompany.biolabsSources);
      residentCompany.companyMembers = [];
      residentCompany.companyAdvisors = [];
      residentCompany.companyTechnicalTeams = [];
      return residentCompany;
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }

  /**
   * Description: This method will update the resident company status.
   * @description This method will update the resident company status.
   * @param payload object of type UpdateResidentCompanyStatusPayload
   * @return resident company object
   */
  async updateResidentCompanyStatus(payload: UpdateResidentCompanyStatusPayload) {
    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: payload.companyId }
    });
    if (residentCompany) {
      residentCompany.companyStatus = payload.companyStatus;
      residentCompany.companyVisibility = payload.companyVisibility;
      residentCompany.companyOnboardingStatus = payload.companyOnboardingStatus;
      this.residentCompanyRepository.update(residentCompany.id, residentCompany);
      return residentCompany;
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }
}