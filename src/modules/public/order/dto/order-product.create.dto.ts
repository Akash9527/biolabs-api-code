import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderProductDto {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
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
  @IsNotEmpty()
  recurrence: boolean;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  @IsNotEmpty()
  currentCharge: boolean;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  startDate: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  endDate: number;

}