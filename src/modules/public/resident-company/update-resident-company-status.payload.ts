import { ApiProperty } from '@nestjs/swagger';

type company_status = '0' | '1' | '2' | '3' | '4' | '5';

export class UpdateResidentCompanyStatusPayload {
  @ApiProperty({
    required: true,
  })
  company_id: number;

  @ApiProperty({
    required: false,
  })
  company_status: company_status[];

  @ApiProperty({
    required: false,
  })
  company_visibility: boolean;

  @ApiProperty({
    required: false,
  })
  company_onboarding_status: boolean;

}
