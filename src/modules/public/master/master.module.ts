import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { PassportModule } from '@nestjs/passport';
import { ProductType } from '../order/model/product-type.entity';
import { FileModule } from '../file';

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([BiolabsSource, Category, Funding, Modality, Role, Site, TechnologyStage, ProductType]),
    PassportModule.register({ defaultStrategy: 'jwt' }),],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' }), MasterService],
})
export class MasterModule { }