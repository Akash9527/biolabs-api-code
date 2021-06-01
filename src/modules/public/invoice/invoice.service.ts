import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOrderDto } from './dto/add-order.payload';
import { Invoice } from './model/invoice.entity';
import { OrderProduct } from './model/order-product.entity';
import { Order } from './model/order.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Order)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>
  ) { }

  /**
   * Description: This method will create the new resident companies invoice details.
   * @description This method will create the new resident companies invoice details.
   * @param payload object of AddInvoiceListDto.
   * @param req object of Request.
   * @return saved invoice object
   */
   async addInvoice(payload: AddOrderDto) {
    let order = new Order();
    order.companyId = payload.companyId;
    // set createdBy
    // set modifiedBy
    await this.orderRepository.save(this.orderRepository.create(order));
    //let orderProduct = payload.orderProducts.map(sub => sub.reduce((obj, pair) => (obj[pair[0]] = pair[1], obj), {}));
    await this.orderProductRepository.save(this.orderProductRepository.create(payload.orderProducts));
    //return await this.invoiceRepository.save(this.invoiceRepository.create(payload));
  }

}