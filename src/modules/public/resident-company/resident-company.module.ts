import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory } from './rc-advisory.entity'
import { ResidentCompanyDocuments } from './rc-documents.entity'
import { ResidentCompanyManagement } from './rc-management.entity'
import { ResidentCompanyTechnical } from './rc-technical.entity'

import { ResidentCompanyService } from './resident-company.service';
import { ResidentCompanyController } from './resident-company.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidentCompany
      , ResidentCompanyAdvisory
      , ResidentCompanyDocuments
      , ResidentCompanyManagement
      , ResidentCompanyTechnical
    ]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            ...(configService.get('JWT_EXPIRATION_TIME')
              ? {
                  expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
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
  providers: [ResidentCompanyService],
})
export class ResidentCompanyModule { }
