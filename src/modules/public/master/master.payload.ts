import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class MasterPayload {
  @ApiProperty({
    required: false,
  })
  q: string;
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
}
