import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AddProductDto } from "./dto/product.dto";

import { ProductService } from "./product.service";

@Controller('api/product')
@ApiTags('Resident Company Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }
  /**
   * Description: This method is used to create a resident company  product details.
   * @description This method is used to create a resident company product details.
   * @param payload it is a request body contains payload of type AddProductDto.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addProduct(@Body() payload: AddProductDto, @Request() req): Promise<any> {
    //console.log(req.user.id,"id --");
    return await this.productService.addProduct(payload, req);
  }
  /**
  * Description: This method is used to fetch a product details .
  * @description This method is used to fetch a  product details .
  * @param payload object of productName.
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':name')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async fetchProducts(@Param('name') name: string): Promise<any> {
    return await this.productService.getProducts(name);
  }
  /**
* Description: This method is used to delete a  product details .
* @description This method is used to delete a  product details .
* @param id it is a request parameter expect a number value of product id.
*/
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteProduct(@Param('id') id: number, @Request() req): Promise<any> {
    return await this.productService.softDeleteProduct(id, req);
  }
}