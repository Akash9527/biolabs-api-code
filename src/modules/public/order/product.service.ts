import { HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
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
        const orderProducts = await this.orderProductRepository.find({
            manuallyEnteredProduct: false,
            productId: id,
        });
        if (product) {
            product.productStatus = 99;
            product.modifiedBy = req.user.id;
            for await (const orderProduct of orderProducts) {
                orderProduct.manuallyEnteredProduct = true;
                orderProduct.productId = orderProduct.id;
                await this.orderProductRepository.update(orderProduct.id, orderProduct);
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
        const month = new Date().getMonth() + 2;
        const orderProducts = await this.orderProductRepository.find({
            manuallyEnteredProduct: false,
            productId: productId,
            month: MoreThanOrEqual(month),
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
            //if recurrence is false 
            if (!payload.recurrence) {
                for await (const orderProduct of orderProducts) {
                    // delete future months order products 
                    if (!payload.recurrence && (orderProduct.month != month)) {
                        await this.orderProductRepository.delete(orderProduct.id);
                    }
                    // Update Order Product for next 1 month
                    if (orderProduct.id) {
                        orderProduct.productName = payload.name;
                        orderProduct.productDescription = payload.description;
                        orderProduct.cost = payload.cost;
                        orderProduct.recurrence = payload.recurrence;
                        orderProduct.productTypeId = payload.productTypeId;
                        await this.orderProductRepository.update(orderProduct.id, orderProduct);
                    }
                }
            } else if (payload.recurrence) {
                for await (const orderProduct of orderProducts) {
                    //Update Order Product as per Product
                    if (orderProduct.id) {
                        orderProduct.productName = payload.name;
                        orderProduct.productDescription = payload.description;
                        orderProduct.cost = payload.cost;
                        orderProduct.recurrence = payload.recurrence;
                        orderProduct.productTypeId = payload.productTypeId;
                        await this.orderProductRepository.update(orderProduct.id, orderProduct);
                    }

                    const futureDateEndMonth = (new Date()).getMonth() + 5;
                    //Add next 3 months invoice
                    for (let i = 1; i < 4; i++) {
                        //quering if orderProduct exist for future months
                        const futureOrderProduct = await this.orderProductRepository.find({
                            manuallyEnteredProduct: false,
                            productId: orderProduct.productId,
                            month: orderProduct.month + i
                        });
                        //if orderProduct doesn't exist for future months then add new Order Products for future months
                        if ((!futureOrderProduct || futureOrderProduct.length == 0) && ((orderProduct.month + i) <= futureDateEndMonth)) {
                            let futureOrderProductObj = JSON.parse(JSON.stringify(orderProduct));

                            if (futureOrderProductObj.month < 12) {
                                futureOrderProductObj.month = futureOrderProductObj.month + i;
                            } else {
                                futureOrderProductObj.month = 1;
                                futureOrderProductObj.year = futureOrderProductObj.year + 1;
                            }
                            futureOrderProductObj.groupId = orderProduct.groupId;
                            futureOrderProductObj.productTypeId = payload.productTypeId;
                            delete futureOrderProductObj['id'];
                            await this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProductObj)).catch(err => {
                                throw new HttpException({
                                    message: err.message
                                }, HttpStatus.NOT_IMPLEMENTED);
                            });
                        }
                    }
                }
            }
            return await this.productRepository.update(productId, product);
        }
        else {
            throw new NotAcceptableException('Product with provided id not available.');
        }
    }
}


