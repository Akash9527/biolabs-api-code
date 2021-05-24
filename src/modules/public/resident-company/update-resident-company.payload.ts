import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Matches, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

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
  @Matches('^[a-zA-Z. ]+')
  name: string;

  @ApiProperty({
    required: true,
  })
  @MaxLength(500)
  companyName: string;

  @ApiProperty({
    required: true,
  })
  @Min(1, { each: true })
  site: number[];

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(1, { each: true })
  biolabsSources: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(100)
  @IsOptional()
  otherBiolabsSources: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @MinLength(1)
  @MaxLength(500)
  technology: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @MinLength(1)
  @MaxLength(500)
  rAndDPath: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  startDate: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @MinLength(1)
  @MaxLength(100)
  foundedPlace: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(1)
  companyStage: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @ValidateIf(o => o.companyStage == '9999')
  @IsNotEmpty()
  @MaxLength(100)
  otherCompanyStage: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  @Min(0)
  funding: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  @Min(1, { each: true })
  fundingSource: number[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @ValidateIf(o => o.companyStage == '9999')
  @IsNotEmpty()
  @MaxLength(100)
  otherFundingSource: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  intellectualProperty: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(100)
  otherIntellectualProperty: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  isAffiliated: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(250)
  affiliatedInstitution: string;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(0)
  noOfFullEmp: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(0)
  empExpect12Months: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(0)
  utilizeLab: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @Min(0)
  expect12MonthsUtilizeLab: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  industry: string[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherIndustries: any;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  modality: string[];

  @ApiProperty({
    required: false,
    nullable: true,
  })
  otherModality: object;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  preferredMoveIn: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @MaxLength(500)
  equipmentOnsite: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(500)
  @IsOptional()
  elevatorPitch: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  companySize: number;

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
  @MaxLength(500)
  @IsOptional()
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
  @MaxLength(500)
  @IsOptional()
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
  @MaxLength(500)
  @IsOptional()
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
  @MaxLength(100)
  @IsOptional()
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
  @MaxLength(100)
  @IsOptional()
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
  @MaxLength(100)
  @IsOptional()
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

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @MaxLength(100)
  @IsOptional()
  foundersBusinessIndustryName:string
}
