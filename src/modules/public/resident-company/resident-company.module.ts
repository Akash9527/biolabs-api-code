import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory } from './rc-advisory.entity';
import { ResidentCompanyDocuments } from './rc-documents.entity';
import { ResidentCompanyManagement } from './rc-management.entity';
import { ResidentCompanyTechnical } from './rc-technical.entity';

import { Site } from '../master/site.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Modality } from '../master/modality.entity';
import { TechnologyStage } from '../master/technology-stage.entity';

import { ResidentCompanyService } from './resident-company.service';
import { ResidentCompanyController } from './resident-company.controller';
import { PassportModule } from '@nestjs/passport';
import { ResidentCompanyHistory } from './resident-company-history.entity';
import { User } from '../user';
import { Mail } from '../../../utils/Mail';
import { Notes } from './rc-notes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidentCompany,
      ResidentCompanyHistory,
      ResidentCompanyAdvisory,
      ResidentCompanyDocuments,
      ResidentCompanyManagement,
      ResidentCompanyTechnical,
      BiolabsSource,
      Category,
      Funding,
      Modality,
      Site,
      TechnologyStage,
      User,
      Notes
    ]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          secret: process.env.APPSETTING_JWT_SECRET_KEY,
          signOptions: {
            ...(process.env.APPSETTING_JWT_EXPIRATION_TIME
              ? {
                expiresIn: Number(process.env.APPSETTING_JWT_EXPIRATION_TIME),
              }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [ResidentCompanyController],
  exports: [ResidentCompanyService],
  providers: [ResidentCompanyService, Mail],
})
export class ResidentCompanyModule {}