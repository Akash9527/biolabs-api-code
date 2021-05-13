import { ApiProperty } from '@nestjs/swagger';

type company_status = '0' | '1' | '2' | '3' | '4' | '5';

export class ListResidentCompanyPayload {
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
  page: number;

  @ApiProperty({
    required: false,
  })
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
  sort: boolean;

  @ApiProperty({
    required: false,
  })
  sortFiled: string;

  @ApiProperty({
    required: false,
  })
  sortOrder: string;
}
