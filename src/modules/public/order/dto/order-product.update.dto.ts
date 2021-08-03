import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderProductDto {

  @ApiProperty({
    required: false,
  })
  productName: string;

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
    required: true,
    nullable: true,
  })
  productTypeId: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  groupId: number;

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
  productId: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  month: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  year: number;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  manuallyEnteredProduct: boolean;

}