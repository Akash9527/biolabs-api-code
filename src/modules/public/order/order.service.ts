import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AddOrderDto } from './dto/add-order.payload';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProduct } from './model/order-product.entity';
import { Order } from './model/order.entity';

@Injectable()
export class OrderProductService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>
  ) { }

  /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of AddOrderDto.
   * @return saved order product object
   */
   async addOrderProduct(payload: AddOrderDto) {
    const newOrder: Order = this.orderRepository.create(payload);
    await this .orderRepository.save(newOrder);
    return await this.orderProductRepository.save(
      this.orderProductRepository.create({...payload.orderProducts, order: newOrder})
    );
    // set createdBy
    // set modifiedBy
    //return newOrder;
  }

  /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of UpdateOrderProductDto.
   * @return updated order product object
   */
   async updateOrderProduct(id: number, payload: UpdateOrderProductDto) {
    const orderProduct = await this.orderProductRepository.findOne(id);
    orderProduct.productName = payload.productName?payload.productName:orderProduct.productName;
    orderProduct.productDescription = payload.productDescription?payload.productDescription:orderProduct.productDescription;
    orderProduct.cost = payload.cost?payload.cost:orderProduct.cost;
    orderProduct.recurrence = payload.recurrence?payload.recurrence:orderProduct.recurrence;
    orderProduct.currentCharge = payload.currentCharge?payload.currentCharge:orderProduct.currentCharge;
    orderProduct.startDate = payload.startDate?payload.startDate:orderProduct.startDate;
    orderProduct.endDate = payload.endDate?payload.endDate:orderProduct.endDate;
    return await this.orderProductRepository.update(id, this.orderProductRepository.create(payload));
  }

  /**
   * @description This method will fetch the order products between given start date and end date
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async fetchOrderProductsBetweenDates(startDate: Date, endDate: Date) {
    let findArgs = { 
      where: { 
        startDate:  MoreThanOrEqual(startDate),
        endDate:  LessThanOrEqual(endDate) 
      }
    };
    return this.orderProductRepository.find(
      findArgs
    );
  }

}
