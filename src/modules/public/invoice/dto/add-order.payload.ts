import { ApiProperty } from "@nestjs/swagger";
import { OrderProductDto } from "./order-product.create.dto";


export class AddOrderDto {
    @ApiProperty({
        required: true,
      })
    companyId: number;
    
    @ApiProperty({
        required: true,
      })
    orderProducts: OrderProductDto[];
}