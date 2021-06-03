import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddOrderDto } from './dto/add-order.payload';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProductService } from './order.service';

@Controller('api/order-product')
@ApiTags('Resident Company Order Product')
export class OrderProductController {
  constructor(
    private readonly orderProductService: OrderProductService
  ) { }

  /**
   * Description: This method is used to create a resident company order product details.
   * @description This method is used to create a resident company order product details.
   * @param payload it is a request body contains payload of type AddOrderDto.
   */
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addOrderProduct(@Body() payload: AddOrderDto): Promise<any> {
    const user = await this.orderProductService.addOrderProduct(payload);
    return user;
  }

  /**
   * Description: This method is used to update a resident company order product details.
   * @description This method is used to update a resident company order product details.
   * @param payload it is a request body contains payload of type AddOrderDto.
   */
   @Put(':id')
   @ApiResponse({ status: 200, description: 'Successful Response' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   async updateOrderProduct(@Param('id') id: number, @Body() payload: UpdateOrderProductDto): Promise<any> {
     const user = await this.orderProductService.updateOrderProduct(id, payload);
     return user;
   }

}
