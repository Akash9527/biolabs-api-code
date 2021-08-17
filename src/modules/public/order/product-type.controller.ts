import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddProductTypeDto } from './dto/AddProductType.dto';
import { ProductTypeService } from './product-type.service';

@Controller('api/product-type')
@ApiTags('Product Type')
export class ProductTypeController {
    constructor(
        private readonly productTypeService: ProductTypeService
    ) { }

    /**
     * Description: This method is used to create a resident company order product details.
     * @description This method is used to create a resident company order product details.
     * @param payload it is a request body contains payload of type AddOrderDto.
     */
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addOrderProduct(@Body() payload: AddProductTypeDto, @Request() req): Promise<any> {
        payload.createdBy = req.user.id;
        payload.modifiedBy = req.user.id;
        return await this.productTypeService.addProductType(payload);
    }

    /**
    * Description: This method is used to fetch a resident company order product details of given month and year.
    * @description This method is used to fetch a resident company order product details of given month and year.
    */
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async fetchOrderProducts(): Promise<any> {
        return await this.productTypeService.getProductType();
    }
}
