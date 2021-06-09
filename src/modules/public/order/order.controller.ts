import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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

  /**
  * Description: This method is used to fetch a resident company order product details of given month and year.
  * @description This method is used to fetch a resident company order product details of given month and year.
  */
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async fetchOrderProductsBetweenDates(@Query('startDate') startDate: Date, @Query('endDate') endDate: Date,): Promise<any> {
    const orderProducts = await this.orderProductService.fetchOrderProductsBetweenDates(startDate, endDate);
    return orderProducts;
  }

  /**
 * Description: This method is used to delete a resident company order product details .
 * @description This method is used to delete a resident company order product details .
 */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrderProduct(@Param('id') id: number): Promise<any> {
    const orderProducts = await this.orderProductService.deleteOrderProduct(id);
    return orderProducts;
  }

}
