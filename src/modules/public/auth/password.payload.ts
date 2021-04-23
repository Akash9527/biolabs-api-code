import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { SameAs } from 'modules/common/validator/same-as.validator';

export class PasswordPayload {
  
  @ApiProperty({
    required: true,
  })
  token: string;
  
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
