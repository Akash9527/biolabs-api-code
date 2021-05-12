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

  async get(id: number) {
    return this.residentCompanyRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.residentCompanyRepository
      .createQueryBuilder('resident-companies')
      .where('resident-companies.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: AddResidentCompanyPayload) {
    const rc = await this.getByEmail(payload.email);

    if (rc) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return await this.residentCompanyRepository.save(this.residentCompanyRepository.create(payload));
  }

  async addResidentCompanyAdvisor(payload: ResidentCompanyAdvisoryFillableFields) {
    const savedRcAdvisor = await this.residentCompanyAdvisoryRepository.save(this.residentCompanyAdvisoryRepository.create(payload));
    return savedRcAdvisor;
  }

  async addResidentCompanyDocument(payload: ResidentCompanyDocumentsFillableFields) {
    const savedRcDocument = await this.residentCompanyDocumentsRepository.save(this.residentCompanyDocumentsRepository.create(payload));
    return savedRcDocument;
  }

  async addResidentCompanyManagement(payload: ResidentCompanyManagementFillableFields) {
    const savedRcManagement = await this.residentCompanyManagementRepository.save(this.residentCompanyManagementRepository.create(payload));
    return savedRcManagement;
  }

  async addResidentCompanyTechnical(payload: ResidentCompanyTechnicalFillableFields) {
    const savedRcTechnical = await this.residentCompanyTechnicalRepository.save(this.residentCompanyTechnicalRepository.create(payload));
    return savedRcTechnical;
  }

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
    if (payload.company_status && payload.company_status.length > 0) {
      _search = { ..._search, ...{ company_status: In(payload.company_status) } };
    }
    if (typeof payload.company_visibility !== 'undefined') {
      _search = { ..._search, ...{ company_visibility: payload.company_visibility } };
    }
    if (typeof payload.company_onboarding_status !== 'undefined') {
      _search = { ..._search, ...{ company_onboarding_status: payload.company_onboarding_status } };
    }
    search = [{ ..._search, status: { $in: ['1', '0'] } }]
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

  async getRcSites(ids) {
    return await this.siteRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

  async getRcCategories(ids) {
    return await this.categoryRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

  async getRcFundings(ids) {
    return await this.fundingRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  async getRcTechnologyStages(ids) {
    return await this.technologyStageRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  async getRcBiolabsSources(ids) {
    return await this.biolabsSourceRepository.findOne({
      select: ["id", "name"],
      where: { id: ids },
    });
  }

  /* async getRcModalities(ids){
    return await this.modalityRepository.find({
      select: ["id", "name"],
      where: {id:In(ids)},
    });
  } */

  async getRcModalities(ids) {
    return await this.modalityRepository.find({
      select: ["id", "name"],
      where: { id: In(ids) },
    });
  }

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
      return residentCompany;
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }

  async updateResidentCompanyStatus(payload: UpdateResidentCompanyStatusPayload) {
    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: payload.company_id }
    });
    if (residentCompany) {
      residentCompany.company_status = payload.company_status;
      residentCompany.company_visibility = payload.company_visibility;
      residentCompany.company_onboarding_status = payload.company_onboarding_status;
      this.residentCompanyRepository.update(residentCompany.id, residentCompany);
      return residentCompany;
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }
}