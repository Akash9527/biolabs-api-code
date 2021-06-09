import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from 'class-validator';

export class MasterPayload {
  @ApiProperty({
    required: false,
    minLength: 3,
    maxLength: 30
  })
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  q: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  pagination: boolean;

  @ApiProperty({
    required: false,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
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
  siteIdArr: number[];
}