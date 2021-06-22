import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderProductDto {

  @ApiProperty({
    required: false,
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
  startDate: string;
  
  @ApiProperty({
    required: true,
    nullable: true,
  })
  endDate: string;
  
  @ApiProperty({
    required: false,
    nullable: true,
  })
  startDtNull: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  endDtNull: boolean;

}