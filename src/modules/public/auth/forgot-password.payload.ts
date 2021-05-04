import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;
}
