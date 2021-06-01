import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddOrderDto } from './dto/add-order.payload';
import { InvoiceService } from './invoice.service';

@Controller('api/invoice')
@ApiTags('Resident Company Invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService
  ) { }

  /**
   * Description: This method is used to create a resident company invoice details of product.
   * @description This method is used to create a resident company invoice details of product.
   * @param payload it is a request body contains payload of type AddOrderDto.
   */
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addInvoice(@Body() payload: AddOrderDto): Promise<any> {
    const user = await this.invoiceService.addInvoice(payload);
    return user;
  }

}
