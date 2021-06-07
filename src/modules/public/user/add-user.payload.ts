import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional } from 'class-validator';
import { Unique } from '../../common';
import { SameAs } from '../../common/validator/same-as.validator';
import { User } from '../user';

type user_type = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

export class AddUserPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()                 
  @Unique([User])
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  role: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  companyId: number;

  @ApiProperty({
    required: true,
  })
  userType: user_type;

  @ApiProperty({
    required: true,
  })
  site_id: number[];

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
    nullable: true
  })
  imageUrl: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  title: string;

  @ApiProperty({
    required: false,
    nullable: true
  })
  phoneNumber: string;

  @ApiProperty({
    required: false,
  })
  password: string;

  @ApiProperty({ required: false })
  @SameAs('password')
  passwordConfirmation: string;
}