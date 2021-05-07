import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { ResidentCompany } from './resident-company.entity';

export class AddResidentCompanyPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @Unique([ResidentCompany])
  email: string;

  @ApiProperty({
    required: true,
  })
  name: string;

  @ApiProperty({
    required: true,
  })
  companyName: string;

  @ApiProperty({
    required: true,
  })
  site: number[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  biolabsSources: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  otherBiolabsSources: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  technology: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  rAndDPath: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  startDate: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  foundedDate: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  companyStage: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  otherCompanyStage: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  funding: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  fundingSource: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  otherFundingSource: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  intellectualProperty: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  otherIntellectualProperty: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  isAffiliated: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  affiliatedInstitution: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  noOfFullEmp: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  empExpect12Months: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  utilizeLab: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  expect12MonthsUtilizeLab: number;

  @ApiProperty({
    required: false,
    nullable: true
  })
  industry: number[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  modality: number[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  advisoryMember:any[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  managementMember:any[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  technicalMember:any[];

  @ApiProperty({
    required: false,
    nullable: true
  })
  documents:any[];
}
