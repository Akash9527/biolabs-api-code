import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOrderDto } from './dto/add-order.payload';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { Invoice } from './model/invoice.entity';
import { OrderProduct } from './model/order-product.entity';
import { Order } from './model/order.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(Order)
    private readonly invoiceRepository: Repository<Invoice>,
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
    let order = new Order();
    order.companyId = payload.companyId;
    // set createdBy
    // set modifiedBy
    await this.orderRepository.save(this.orderRepository.create(order));
    return await this.orderProductRepository.save(this.orderProductRepository.create(payload.orderProducts));
    //return await this.invoiceRepository.save(this.invoiceRepository.create(payload));
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
    orderProduct.cost = payload.cost?payload.cost:orderProduct.cost;
    orderProduct.recurrence = payload.recurrence?payload.recurrence:orderProduct.recurrence;
    orderProduct.currentCharge = payload.currentCharge?payload.currentCharge:orderProduct.currentCharge;
    orderProduct.endDate = payload.endDate?payload.endDate:orderProduct.endDate;
    return await this.orderProductRepository.update(id, this.orderProductRepository.create(payload));
  }

}