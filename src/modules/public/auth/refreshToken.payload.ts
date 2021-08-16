import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class refreshTokenPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  accessToken: string;
}