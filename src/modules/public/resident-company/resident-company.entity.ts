import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// import { Site } from '../master/site.entity';
// import { Category } from '../master/category.entity';
// import { Funding } from '../master/funding.entity';
// import { BiolabsSource } from '../master/biolabs-source.entity';
// import { Modality } from '../master/modality.entity';
// import { TechnologyStage } from '../master/technology-stage.entity';
/**
 * -1 = De-active
 * 0 = Pending/Default/
 * 1 = Active
 * 96 = 
 * 97 = 
 * 98 = 
 * 99 = Soft delete (Deleted by admin)
 */
type status_enum = '-1' | '0' | '1' | '99';
type company_status = '0' | '1' | '2' | '3' | '4' | '5';

@Entity({
  name: 'resident_companies',
})
export class ResidentCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  companyName: string;

  @Column("int", { array: true, nullable: true })
  site: number[];

  @Column({ nullable: true })
  biolabsSources: number;

  @Column({ length: 255, nullable: true })
  otherBiolabsSources: string;

  @Column({ nullable: true })
  technology: string;

  @Column({ nullable: true })
  rAndDPath: string;

  @Column({ nullable: true })
  startDate: number;

  @Column({ nullable: true })
  foundedDate: number;

  @Column({ nullable: true })
  companyStage: number;

  @Column({ length: 255, nullable: true })
  otherCompanyStage: string;

  @Column({ length: 255, nullable: true })
  funding: string;

  @Column({ nullable: true })
  fundingSource: number;

  @Column({ length: 255, nullable: true })
  otherFundingSource: string;

  @Column({ length: 255, nullable: true })
  intellectualProperty: string;

  @Column({ length: 255, nullable: true })
  otherIntellectualProperty: string;

  @Column({ length: 255, nullable: true })
  isAffiliated: string;

  @Column({ length: 255, nullable: true })
  affiliatedInstitution: string;

  @Column({ nullable: true })
  noOfFullEmp: number;

  @Column({ nullable: true })
  empExpect12Months: number;

  @Column({ nullable: true })
  utilizeLab: number;

  @Column({ nullable: true })
  expect12MonthsUtilizeLab: number;

  @Column("int", { array: true })
  industry: string[];

  @Column("int", { array: true })
  modality: string[];

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @Column({ length: 255, enum: ['0', '1', '2', '3', '4', '5'], default: '0' })
  company_status: company_status;

  @Column({ default: false })
  company_visibility: boolean;

  @Column({ default: false })
  company_onboarding_status: boolean;

}

export class ResidentCompanyFillableFields {
  email: string;
  name: string;
  companyName: string;
  site: number[];
  biolabsSources: number;
  otherBiolabsSources: string;
  technology: string;
  rAndDPath: string;
  startDate: number;
  foundedDate: number;
  companyStage: number;
  otherCompanyStage: string;
  funding: string;
  fundingSource: number;
  otherFundingSource: string;
  intellectualProperty: string;
  otherIntellectualProperty: string;
  isAffiliated: string;
  affiliatedInstitution: string;
  noOfFullEmp: number;
  empExpect12Months: number;
  utilizeLab: number;
  expect12MonthsUtilizeLab: number;
  industry: string[];
  modality: string[];
  status: status_enum;
  company_status:company_status;
  company_visibility:boolean;
  company_onboarding_status: boolean;
}
