import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class UpdateOrderProductDto {

  @ApiProperty({
    required: true,
  })
  productName: string;

  // @ApiProperty({
  //   required: true,
  //   nullable: true,
  // })
  // @IsNotEmpty()
  // companyId: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  cost: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  recurrence: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  currentCharge: boolean;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  endDate: number;

}