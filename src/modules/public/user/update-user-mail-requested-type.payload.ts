import { ApiProperty } from '@nestjs/swagger';

type emailReceivingType = '0' | '1' | '2';

export class UpdateUserEmailReceivingTypePayload {

  @ApiProperty({
    required: true,
  })
  mailsRequestType: emailReceivingType;

  @ApiProperty({
    required: true,
  })
  id: number;
}