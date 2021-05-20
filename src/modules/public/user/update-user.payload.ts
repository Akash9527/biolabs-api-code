import { ApiProperty } from '@nestjs/swagger';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { IsNumber, IsOptional } from 'class-validator';

type user_type = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

export class UpdateUserPayload {

  @ApiProperty({
    required: true,
  })
  userType: user_type;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  companyId: number;

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
