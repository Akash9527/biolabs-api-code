import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class UpdateUserRequestMailsPayload {

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  isRequestedMails: boolean;

  @ApiProperty({
    required: true,
  })
  id: number;
}