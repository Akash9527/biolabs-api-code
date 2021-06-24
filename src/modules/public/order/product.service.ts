import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./model/product.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of AddOrderDto.
   * @return saved order product object
   */
    async addProduct(payLoad, req: any): Promise<any> {
        const product = new Product();
        product.name = payLoad.name;
        product.description = payLoad.description;
        product.cost = payLoad.cost;
        product.createdBy = req.user.id;
        product.modifiedBy=req.user.id;
        return await this.productRepository.save(await this.productRepository.create(product));
    }
    /**
       * Description: This method is used to get the products by productName.
       * @description This method is used to get the products by productName.
       * @param productName is product name
       * @return products object
       */
    async getProducts(payloadName: string): Promise<any> {
        return await this.productRepository
            .createQueryBuilder("product")
            .where("product.name ILike :name", { name: `%${payloadName}%` })
            .andWhere("product.productStatus=1")
            .getRawMany();

    }
    /**
  * @description This method will Delete the products.
  * @param id it is a request parameter expect a number value of product id.
  * @returns  product object with status 99
  */
    async softDeleteProduct(id: number,req:any) {
        const product = await this.productRepository.findOne(id);
        if (product) {
            product.productStatus = 99;
            product.modifiedBy=req.user.id;
            return await this.productRepository.update(id,product);
        } else {
            throw new NotAcceptableException('Product with provided id not available.');
        }
    }

}


