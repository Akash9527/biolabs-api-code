import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class refreshTokenPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  accessToken: string;
}