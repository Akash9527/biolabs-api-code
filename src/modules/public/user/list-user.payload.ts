import { ApiProperty } from '@nestjs/swagger';

export class ListUserPayload {
  @ApiProperty({
    required: false,
  })
  q: string;

  @ApiProperty({
    required: false,
  })
  role: number;

  @ApiProperty({
    required: false,
  })
  pagination: boolean;

  @ApiProperty({
    required: false,
  })
  page: number;

  @ApiProperty({
    required: false,
  })
  limit: number;

  @ApiProperty({
    required: false,
  })
  sort: boolean;

  @ApiProperty({
    required: false,
  })
  sortFiled: string;

  @ApiProperty({
    required: false,
  })
  sortOrder: string;
}