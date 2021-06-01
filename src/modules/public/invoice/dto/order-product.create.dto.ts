import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class OrderProductDto {
  [x: string]: any;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  productName: string;

  // @ApiProperty({
  //   required: true,
  //   nullable: true,
  // })
  // @IsNotEmpty()
  // companyId: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  cost: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  recurrence: boolean;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  currentCharge: boolean;

}