import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPayload {

  @ApiProperty({
    required: true,
  })
  firstName: string;

  @ApiProperty({
    required: true,
  })
  lastName: string;

  @ApiProperty({
    required: false,
    nullable:true
  })
  title: string;

  @ApiProperty({
    required: false,
    nullable:true
  })
  phoneNumber: string;
  
  @ApiProperty({
    required: true,
  })
  site_id: number[];

  @ApiProperty({
    required: true,
  })
  id: number;
}
