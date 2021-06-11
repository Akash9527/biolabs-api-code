import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProductService } from './order-product.service';

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
  async addOrderProduct(@Body() payload: CreateOrderProductDto): Promise<any> {
    return await this.orderProductService.addOrderProduct(payload);
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
    return await this.orderProductService.updateOrderProduct(id, payload);
  }

  /**
  * Description: This method is used to fetch a resident company order product details of given month and year.
  * @description This method is used to fetch a resident company order product details of given month and year.
  */
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'companyId', required: true, type: 'string' })
  async fetchOrderProductsBetweenDates(@Query('companyId') companyId: number, @Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<any> {
    return await this.orderProductService.fetchOrderProductsBetweenDates(startDate, endDate, companyId);
  }


  /**
 * Description: This method is used to delete a resident company order product details .
 * @description This method is used to delete a resident company order product details .
 */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrderProduct(@Param('id') id: number): Promise<any> {
    return await this.orderProductService.deleteOrderProduct(id);
  }

}
