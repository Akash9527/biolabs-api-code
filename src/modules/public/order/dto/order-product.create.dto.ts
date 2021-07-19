import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderProductDto {

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  status: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    required: true,
  })
  productDescription: string;

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
  quantity: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  groupId: number;

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

  @ApiProperty({
    required: false,
    nullable: true,
  })
  startDate: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  endDate: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  manuallyEnteredProduct: boolean;

}