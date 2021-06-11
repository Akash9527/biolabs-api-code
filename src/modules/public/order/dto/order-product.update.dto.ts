import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderProductDto {

  @ApiProperty({
    required: true,
  })
  productName: string;

  @ApiProperty({
    required: true,
  })
  productDescription: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  cost: number;
  
  @ApiProperty({
    required: false,
    nullable: true,
  })
  quantity: number;

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
  startDate: Date;
  
  @ApiProperty({
    required: true,
    nullable: true,
  })
  endDate: Date;

}