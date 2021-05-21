import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';
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
}