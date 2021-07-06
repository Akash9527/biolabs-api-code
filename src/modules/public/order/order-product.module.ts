import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from 'utils/Mail';
import { ConfigModule, ConfigService } from '../../config';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { Modality } from '../master/modality.entity';
import { Site } from '../master/site.entity';
import { TechnologyStage } from '../master/technology-stage.entity';
import { ResidentCompany, ResidentCompanyAdvisory, ResidentCompanyController, ResidentCompanyDocuments, ResidentCompanyManagement, ResidentCompanyService, ResidentCompanyTechnical } from '../resident-company';
import { Notes } from '../resident-company/rc-notes.entity';
import { ResidentCompanyHistory } from '../resident-company/resident-company-history.entity';
import { User } from '../user';
import { OrderProduct } from './model/order-product.entity';
import { ProductType } from './model/product-type.entity';
import { Product } from './model/product.entity';
import { OrderProductController } from './order-product.controller';
import { OrderProductService } from './order-product.service';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderProduct, Product, ProductType,
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
  controllers: [OrderProductController, ProductController, ProductTypeController, ResidentCompanyController],
  exports: [OrderProductService, ProductService, ProductTypeService],
  providers: [OrderProductService, ProductService, ProductTypeService, ResidentCompanyService, Mail],
})
export class OrderProductModule { }