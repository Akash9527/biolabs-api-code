import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AddProductDto } from "./dto/AddProduct.dto";
import { UpdateProductDto } from "./dto/UpdateProduct.dto";
import { ProductService } from "./product.service";

@Controller('api/product')
@ApiTags('Resident Company Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  /**
   * Description: This method is used to create a product details.
   * @description This method is used to create  product details.
   * @param payload it is a request body contains payload of type AddProductDto.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addProduct(@Body() payload: AddProductDto, @Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return await this.productService.addProduct(payload, req, siteIdArr);
  }

  /**
  * Description: This method is used to fetch a product details .
  * @description This method is used to fetch a  product details .
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async fetchALLProducts(@Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    if (siteIdArr.length > 0) {
      return await this.productService.getAllProducts(siteIdArr);
    } else {
      return "please provide siteId";
    }
  }

  /**
   * Description: This method is used to fetch a product details based on productname .
   * @description This method is used to fetch a  product details based on productname  .
   * @param payload object of productName.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':name')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async fetchProducts(@Param('name') name: string, @Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return await this.productService.getProductsByName(name, siteIdArr);
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

  /**
   * Description: This method is used to update a  product details.
   * @description This method is used to update a  product details.
   * @param payload it is a request body contains payload of type UpdateProductDto.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProduct(@Param('id') id: number, @Body() payload: UpdateProductDto, @Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return await this.productService.updateProduct(id, payload, req, siteIdArr);
  }
}