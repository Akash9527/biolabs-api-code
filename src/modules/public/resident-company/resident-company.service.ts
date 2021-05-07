import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AddResidentCompanyPayload } from './add-resident-company.payload';

import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from './rc-advisory.entity'
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from './rc-documents.entity'
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from './rc-management.entity'
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from './rc-technical.entity'

import { Request } from 'express';

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
    if(savedRc){
      
    }
    return savedRc;
  }
}