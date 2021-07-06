import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { AddProductDto } from "./dto/AddProduct.dto";
import { UpdateProductDto } from "./dto/UpdateProduct.dto";
import { OrderProduct } from "./model/order-product.entity";
import { ProductType } from "./model/product-type.entity";
import { Product } from "./model/product.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductType)
        private readonly productTypeRepository: Repository<ProductType>,
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
    ) { }

    /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of AddOrderDto.
   * @return saved order product object
   */
    async addProduct(payLoad: AddProductDto, req: any, siteId: number): Promise<any> {
        let productType = null;
        if (payLoad.productTypeId) {
            productType = await this.productTypeRepository.findOne(payLoad.productTypeId);
        }
        const product = new Product();
        product.name = payLoad.name;
        product.description = payLoad.description;
        product.recurrence = payLoad.recurrence;
        product.cost = payLoad.cost;
        product.siteId = siteId;
        product.createdBy = req.user.id;
        product.modifiedBy = req.user.id;
        product.productType = productType;
        return await this.productRepository.save(await this.productRepository.create(product));
    }

    /**
       * Description: This method is used to get the products by productName.
       * @description This method is used to get the products by productName.
       * @param productName is product name
       * @return products object
       */
    async getProductsByName(payloadName: string, siteId: number[]): Promise<any> {
        return await this.productRepository
            .createQueryBuilder("product")
            .where("product.name ILike :name", { name: `%${payloadName}%` })
            .andWhere("product.productStatus=1")
            .andWhere("product.siteId IN (:...siteId)", { siteId: [siteId] })
            .getRawMany();
    }

    /**
        * Description: This method is used to get the products .
        * @description This method is used to get the products .
        * @return products object
        */
    async getAllProducts(siteId: number): Promise<any> {
        return await this.productRepository
            .createQueryBuilder("product")
            .where("product.productStatus=1")
            .andWhere("product.siteId IN (:...siteId)", { siteId: [siteId] })
            .orderBy("product.modifiedAt", "DESC")
            .getRawMany();
    }

    /**
       * @description This method will Delete the products.
       * @param id it is a request parameter expect a number value of product id.
       * @returns  product object with status 99
       */
    async softDeleteProduct(id: number, req: any) {
        const product = await this.productRepository.findOne(id);
        const month = new Date().getMonth()+2;
        const orderProducts = await this.orderProductRepository.find({
            manuallyEnteredProduct: false,
            productId: id,
            month: MoreThanOrEqual(month)
        });
        if (product) {
            product.productStatus = 99;
            product.modifiedBy = req.user.id;
            for await (const orderProduct of orderProducts) {
                await this.orderProductRepository.delete(orderProduct.id);
            }
            return await this.productRepository.update(id, product);
        } else {
            throw new NotAcceptableException('Product with provided id not available.');
        }
    }
    /**
       * @description This method will update the products.
       * @param id it is a request parameter expect a number value of product id.
       * @returns  update product with  only status 1
       */
    async updateProduct(productId: number, payload: UpdateProductDto, req: any, siteId: number): Promise<any> {
        const product = await this.productRepository.findOne(productId);
        const month = new Date().getMonth()+2;
        const orderProducts = await this.orderProductRepository.find({
            manuallyEnteredProduct: false,
            productId: productId,
            month: MoreThanOrEqual(month)
        });
        let productType = null;
        if (payload.productTypeId) {
            productType = await this.productTypeRepository.findOne(payload.productTypeId);
        }
        if (product && (product.productStatus == 1)) {
            product.modifiedBy = req.user.id;
            product.siteId = siteId;
            product.name = payload.name;
            product.description = payload.description;
            product.cost = payload.cost;
            product.recurrence = payload.recurrence;
            product.productType = productType;

            for await (const orderProduct of orderProducts) {
                orderProduct.productName = payload.name;
                orderProduct.productDescription = payload.description;
                orderProduct.cost = payload.cost;
                await this.orderProductRepository.update(orderProduct.id, orderProduct)
            }

            return await this.productRepository.update(productId, product);
        }
        else {
            throw new NotAcceptableException('Product with provided id not available.');
        }
    }
}


