import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
    let order : Order;
    if(payload.orderId){
      payload.orderProducts['orderId'] = payload.orderId;
      order = await this.orderRepository.findOne(payload.orderId);
    }else{
      order = this.orderRepository.create(payload);
      await this .orderRepository.save(order);
    }
    return await this.orderProductRepository.save(this.orderProductRepository.create({...payload.orderProducts , order: order}));
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
  async fetchOrderProductsBetweenDates(startDate: string, endDate: string, companyId: number) {
    let filter = {};
    filter['createdAt'] = Between(new Date(startDate), new Date(endDate));
    if(companyId)
      filter['companyId'] = companyId;
      
    return await this.orderRepository.find({
      where: filter,
      join: {
          alias: "order",
          leftJoinAndSelect: {
              "orderProducts": "order.orderProducts"
          }
      }
    });
  }

  /**
   * @description This method will Delete the order products.
   * @param id this is orderProduct Id
   * @returns  
   */
   async deleteOrderProduct(id : number) {    
    return await this.orderProductRepository.delete(id);
  }

}
