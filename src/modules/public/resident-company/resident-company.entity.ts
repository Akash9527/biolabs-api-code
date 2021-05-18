import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ length: 510, nullable: true })
  email: string;

  @Column({ length: 510, nullable: true })
  name: string;

  @Column({ length: 510, nullable: true })
  companyName: string;

  @Column("int", { array: true, nullable: true })
  site: number[];

  @Column({ nullable: true })
  biolabsSources: number;

  @Column({ length: 510, nullable: true })
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

  @Column({ length: 510, nullable: true })
  otherCompanyStage: string;

  @Column({ length: 510, nullable: true })
  funding: string;

  @Column({ nullable: true })
  fundingSource: number;

  @Column({ length: 510, nullable: true })
  otherFundingSource: string;

  @Column({ length: 510, nullable: true })
  intellectualProperty: string;

  @Column({ length: 510, nullable: true })
  otherIntellectualProperty: string;

  @Column({ length: 510, nullable: true })
  isAffiliated: string;

  @Column({ length: 510, nullable: true })
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
  companyStatus: company_status;

  @Column({ default: false })
  companyVisibility: boolean;

  @Column({ default: false })
  companyOnboardingStatus: boolean;

  @Column({ length: 510, default: null, nullable: true })
  elevatorPitch: string;

  @Column({ default: null })
  logoOnWall: boolean;

  @Column({ default: null })
  logoOnLicensedSpace: boolean;

  @Column({ default: null })
  bioLabsAssistanceNeeded: boolean;

  @Column({ default: null })
  technologyPapersPublished: boolean;

  @Column({ default: null })
  patentsFiledGranted: boolean;

  @Column({ length: 510, default: null, nullable: true })
  patentsFiledGrantedDetails: string;

  @Column({ default: null })
  foundersBusinessIndustryBefore: boolean;

  @Column({ default: null })
  academiaPartnerships: boolean;

  @Column({ length: 510, default: null, nullable: true })
  academiaPartnershipDetails: string;

  @Column({ default: null })
  industryPartnerships: boolean;

  @Column({ length: 510, default: null, nullable: true })
  industryPartnershipsDetails: string;

  @Column({ default: null })
  newsletters: boolean;

  @Column({ default: null })
  shareYourProfile: boolean;

  @Column({ length: 510, default: null, nullable: true })
  equipmentOnsite: string;
  
  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
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
  companyStatus: company_status;
  companyVisibility: boolean;
  companyOnboardingStatus: boolean;
  elevatorPitch: string;
  logoOnWall: boolean;
  logoOnLicensedSpace: boolean;
  bioLabsAssistanceNeeded: boolean;
  technologyPapersPublished: boolean;
  patentsFiledGranted: boolean;
  patentsFiledGrantedDetails: string;
  foundersBusinessIndustryBefore: boolean;
  academiaPartnerships: boolean;
  academiaPartnershipDetails: string;
  industryPartnerships: boolean;
  industryPartnershipsDetails: string;
  newsletters: boolean;
  shareYourProfile: boolean;
  equipmentOnsite: string;
}
