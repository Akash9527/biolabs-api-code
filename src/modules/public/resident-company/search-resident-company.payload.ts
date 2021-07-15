import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Min, ValidateIf } from 'class-validator';
import { GreaterThanEqualsTo } from '../../common/validator/greater-than-equals-to.validator';
import { LessThanEqualsTo } from '../../common/validator/less-than-equals-to.validator';

type company_status = '0' | '1' | '2' | '3' | '4' | '5';
type sortOrderType = 'ASC' | 'DESC'
export class SearchResidentCompanyPayload {
  @ApiProperty({
    required: false,
  })
  q: string;

  @ApiProperty({
    required: false,
  })
  role: number;

  @ApiProperty({
    required: false,
  })
  pagination: boolean;

  @ApiProperty({
    required: false,
  })
  @ValidateIf(o => o.pagination == 'true')
  @Min(0)
  page: number;

  @ApiProperty({
    required: false,
  })
  @ValidateIf(o => o.pagination == 'true')
  @Min(1)
  limit: number;

  @ApiProperty({
    required: false,
  })
  companyStatus: company_status;

  @ApiProperty({
    required: false,
  })
  companyVisibility: boolean;

  @ApiProperty({
    required: false,
  })
  companyOnboardingStatus: boolean;

  @ApiProperty({
    required: false,
  })
  siteIdArr: number[];

  @ApiProperty({
    required: false,
  })
  industries: number[];

  @ApiProperty({
    required: false,
  })
  modalities: number[];

  @ApiProperty({
    required: false,
  })
  fundingSource: number[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => typeof o.maxFund != 'undefined')
  @LessThanEqualsTo('maxFund')
  minFund: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => typeof o.minFund != 'undefined')
  @GreaterThanEqualsTo('minFund')
  maxFund: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => typeof o.maxCompanySize != 'undefined')
  @LessThanEqualsTo('maxCompanySize')
  minCompanySize: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateIf(o => typeof o.minCompanySize != 'undefined')
  @GreaterThanEqualsTo('minCompanySize')
  maxCompanySize: number;

  @ApiProperty({
    required: false,
  })
  sort: boolean;

  @ApiProperty({
    required: false,
  })
  @ValidateIf(o => o.sort == 'true')
  @IsNotEmpty()
  sortFiled: string;

  @ApiProperty({
    required: false,
  })
  @ValidateIf(o => o.sort == 'true')
  @IsNotEmpty()
  sortOrder: sortOrderType;

}