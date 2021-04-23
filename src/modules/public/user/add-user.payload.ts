import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { User } from 'modules/public/user';

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
    required: true,
  })
  title: string;

  @ApiProperty({
    required: true,
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
