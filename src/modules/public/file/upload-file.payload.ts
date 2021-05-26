import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

type FILE_TYPE = 'user' | 'logo' | 'pitchdeck';

export class UploadPayload {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  userId: Number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  companyId: Number;

  @ApiProperty({
    required: true,
  })
  imgType: FILE_TYPE;

}