import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UploadPayload {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  userId: Number;

  @ApiProperty({
    required: true,
  })
  userType: String;

}
