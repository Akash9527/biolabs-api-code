import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPayload {

  @ApiProperty({
    required: true,
  })
  site_id: string;

  @ApiProperty({
    required: true,
  })
  id: number;
}
