import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProduct } from './model/order-product.entity';

@Injectable()
export class OrderProductService {

  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>
  ) { }

  /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of AddOrderDto.
   * @return saved order product object
   */
  async addOrderProduct(orderProduct: CreateOrderProductDto) {

    const todayDate = new Date();
    // checking StartDate
    if (orderProduct.startDate && isNaN(Date.parse(orderProduct.startDate.trim()))) {
      return 'Prodvide correct date formate';
    }

    // checking End Date
    if (orderProduct.endDate && isNaN(Date.parse(orderProduct.endDate.trim()))) {
      return 'Prodvide correct date formate';
    }

    //date Validation
    if ((orderProduct.startDate && ((new Date(orderProduct.startDate) < (new Date(`${todayDate.getMonth() + 1}/01/${todayDate.getFullYear()} 00:00:00`))) ||
      (orderProduct.startDate && orderProduct.endDate && (new Date(orderProduct.endDate) < new Date(orderProduct.startDate)))))) {
      return { error: 'Please Select Valid Start Date and End Date' }
    }

    /**
     * **********************************End*************************************
     */
    // Set status "0" invoice not created
    orderProduct.status = 0;
    const orderSave = await this.orderProductRepository.save(this.orderProductRepository.create(orderProduct)).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });

    if (orderProduct.recurrence) {
      /**
       * Add next 3 months Products
       */
      for (let i = 1; i <= 3; i++) {

        let futureOrderProduct = { ...orderProduct };
        futureOrderProduct.month = orderProduct.month + i;
        futureOrderProduct.productId = (orderProduct.manuallyEnteredProduct) ? orderSave.id : orderProduct.productId;
        this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProduct)).catch(err => {
          throw new HttpException({
            message: err.message
          }, HttpStatus.BAD_REQUEST);
        });
      }
    }
    return { message: 'Added successfully', status: true };
  }

  /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of UpdateOrderProductDto.
   * @return updated order product object
   */
  async updateOrderProduct(id: number, payload: UpdateOrderProductDto) {

    /**
    * ***********************setting Default Dates***********************
    */
    // Setting StartDate
    if (isNaN(Date.parse(payload.startDate.trim()))) {
      return 'Prodvide correct date formate';
    }

    // Setting End Date
    if (isNaN(Date.parse(payload.endDate.trim()))) {
      return 'Prodvide correct date formate';
    }
    /**
     * **********************************End*************************************
     */
    const orderProduct = await this.orderProductRepository.findOne(id).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });

    const futureProducts = await this.orderProductRepository.find({
      where: {
        productName: orderProduct.productName,
        status: 0,
        month: MoreThanOrEqual(orderProduct.month),
      }
    }).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id).catch(err => {
          throw new HttpException({
            message: err.message
          }, HttpStatus.BAD_REQUEST);
        });
      }
    } else {
      for await (const product of futureProducts) {
        let futureOrderProduct = { ...payload };
        futureOrderProduct.month = product.month;
        futureOrderProduct.productId = product.productId;
        await this.orderProductRepository.update(product.id, futureOrderProduct).catch(err => {
          throw new HttpException({
            message: err.message
          }, HttpStatus.BAD_REQUEST);
        });
      }
    }
    return await this.orderProductRepository.update(id, payload).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });
  }

  /**
   * @description This method will fetch the order products between given start date and end date
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async fetchOrderProductsBetweenDates(month: number, companyId: number) {

    return await this.orderProductRepository.createQueryBuilder("order_product")
      .where("order_product.companyId = :companyId", { companyId: companyId })
      .andWhere("order_product.month = :month", { month: month })
      .orderBy("order_product.updatedAt", 'DESC')
      .getRawMany();

  }

  /**
   * @description This method will Delete the order products.
   * @param id this is orderProduct Id
   * @returns  
   */
  async deleteOrderProduct(id: number) {

    const orderProductArray = await this.orderProductRepository.findByIds([id]);
    const orderProduct = orderProductArray[0];
    const deleteProducts = await this.orderProductRepository.find({
      productName: orderProduct.productName,
      status: 0,
      month: MoreThanOrEqual(orderProduct.month)
    });
    for await (const product of deleteProducts) {
      await this.orderProductRepository.delete(product.id);
    }
    return await this.orderProductRepository.delete(id);
  }

}
