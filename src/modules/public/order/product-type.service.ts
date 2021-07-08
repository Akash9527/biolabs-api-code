import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddProductTypeDto } from './dto/AddProductType.dto';
import { ProductType } from './model/product-type.entity';

@Injectable()
export class ProductTypeService {

    constructor(
        @InjectRepository(ProductType)
        private readonly productTypeRepository: Repository<ProductType>
    ) { }

    /**
     * Description: This method will create the new order product details.
     * @description This method will create the new order product details.
     * @param AddProductTypeDto object of AddProductTypeDto.
     * @return saved order product object
     */
    async addProductType(addProductTypeDto: AddProductTypeDto) {
        return await this.productTypeRepository.save(this.productTypeRepository.create(addProductTypeDto));
    }

    /**
     * Description: GET All product Type.
     * @description GET All product Type
     * @returns All product type
     */
    async getProductType() {
        return await await this.productTypeRepository.find();
    }
}
