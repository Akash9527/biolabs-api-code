import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateResidentCompanyPayload {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    required: true,
  })
  @MaxLength(500)
  companyName: string;

  @ApiProperty({
    required: true,
  })
  site: number[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  biolabsSources: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(100)
  otherBiolabsSources: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  technology: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  rAndDPath: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  startDate: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  companySize: number;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  foundedPlace: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  companyStage: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherCompanyStage: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  funding: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  fundingSource: number[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherFundingSource: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  intellectualProperty: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherIntellectualProperty: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  isAffiliated: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  affiliatedInstitution: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  noOfFullEmp: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  empExpect12Months: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  utilizeLab: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  expect12MonthsUtilizeLab: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  industry: string[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherIndustries: any;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  modality: string[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherModality: object;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  preferredMoveIn: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  equipmentOnsite: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  elevatorPitch: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  logoOnWall: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  logoOnLicensedSpace: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  bioLabsAssistanceNeeded: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  technologyPapersPublished: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  technologyPapersPublishedLink: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  patentsFiledGranted: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  patentsFiledGrantedDetails: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  foundersBusinessIndustryBefore: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  academiaPartnerships: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  academiaPartnershipDetails: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  industryPartnerships: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  industryPartnershipsDetails: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  newsletters: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  shareYourProfile: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  website: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  companyMembers: [];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  companyAdvisors: [];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  companyTechnicalTeams: [];
}
