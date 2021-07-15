import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserPayload {

  @ApiProperty({
    required: true,
  })
  id: number;
}