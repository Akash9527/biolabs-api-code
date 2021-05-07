import { ApiProperty } from '@nestjs/swagger';
import { SameAs } from 'modules/common/validator/same-as.validator';

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
    required: false,
  })
  password: string;

  @ApiProperty({ required: false })
  @SameAs('password')
  passwordConfirmation: string;

  @ApiProperty({
    required: true,
  })
  id: number;
}
