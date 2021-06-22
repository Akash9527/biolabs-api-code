import { ApiProperty } from '@nestjs/swagger';

type company_status = '0' | '1' | '2' | '3' | '4' | '5';
type committee_status = '0' | '1' | '2' | '3';

export class UpdateResidentCompanyStatusPayload {
  @ApiProperty({
    required: true,
  })
  companyId: number;

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
  committeeStatus: committee_status;

  @ApiProperty({
    required: false,
  })
  selectionDate: Date;
}