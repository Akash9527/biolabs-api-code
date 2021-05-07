import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory } from './rc-advisory.entity'
import { ResidentCompanyDocuments } from './rc-documents.entity'
import { ResidentCompanyManagement } from './rc-management.entity'
import { ResidentCompanyTechnical } from './rc-technical.entity'

import { ResidentCompanyService } from './resident-company.service';
import { ResidentCompanyController } from './resident-company.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidentCompany
      , ResidentCompanyAdvisory
      , ResidentCompanyDocuments
      , ResidentCompanyManagement
      , ResidentCompanyTechnical
    ]),
    ConfigModule
  ],
  controllers: [ResidentCompanyController],
  exports: [ResidentCompanyService],
  providers: [ResidentCompanyService],
})
export class ResidentCompanyModule { }
