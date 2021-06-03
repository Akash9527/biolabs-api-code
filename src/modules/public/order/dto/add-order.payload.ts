import { ApiProperty } from "@nestjs/swagger";
import { CreateOrderProductDto } from "./order-product.create.dto";


export class AddOrderDto {
    @ApiProperty({
        required: true,
      })
    companyId: number;
    
    @ApiProperty({
        required: true,
        type: CreateOrderProductDto
      })
    orderProducts: CreateOrderProductDto[];
}