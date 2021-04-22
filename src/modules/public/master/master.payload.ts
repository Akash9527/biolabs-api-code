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
  @IsBoolean()
  pagination: boolean;
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  page: number;
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  limit: number;
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  sort: boolean;
  @ApiProperty({
    required: false,
  })
  sortFiled: string;
}
