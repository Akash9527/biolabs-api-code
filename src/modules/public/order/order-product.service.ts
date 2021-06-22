import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
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

    /**
    * ***********************setting Default Dates***********************
    */
    let startDate = new Date();
    let endDate = new Date();
    const todayDate = new Date();
    orderProduct.startDtNull = false;
    orderProduct.endDtNull = false;

    // Setting StartDate
    if (!orderProduct.startDate) {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      orderProduct.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-1`;
      orderProduct.startDtNull = true;
    } else if(!isNaN(Date.parse(orderProduct.startDate.trim()))) {
      return 'Prodvide correct date formate';
    }

    // Setting End Date
    if (!orderProduct.endDate) {
      endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      orderProduct.endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${lastDay} 23:59:59`;
      orderProduct.endDtNull = true;
    } else if(!isNaN(Date.parse(orderProduct.startDate.trim()))) {
      return 'Prodvide correct date formate';
    }

    /**
     * **********************************End*************************************
     */
    if (!orderProduct.startDate || !orderProduct.endDate || ((new Date(orderProduct.startDate) < (new Date(`${todayDate.getMonth() + 1}/01/${todayDate.getFullYear()} 00:00:00`)))
      || (new Date(orderProduct.endDate) < new Date(orderProduct.startDate)))) {
      return { error: 'Please Select Valid Start Date and End Date' };
    }

    /**
     * **********************************End*************************************
     */
    // Set status "0" invoice not created
    orderProduct.status = 0;
    if (orderProduct.recurrence) {
      /**
       * Add next 3 months Products
       */
      for (let i = 1; i <= 3; i++) {

        let futureOrderProduct = { ...orderProduct };
        let sDate = new Date(futureOrderProduct.startDate);

        const startDT = new Date(sDate.setMonth(sDate.getMonth() + i));
        const lastDay = new Date(startDT.getFullYear(), startDT.getMonth() + 1, 0).getDate();

        futureOrderProduct.startDtNull = false;
        futureOrderProduct.endDtNull = false;
        futureOrderProduct.currentCharge = true;
        futureOrderProduct.startDate = `${startDT.getFullYear()}-${startDT.getMonth() + 1}-01`;
        futureOrderProduct.endDate = `${startDT.getFullYear()}-${startDT.getMonth() + 1}-${lastDay} 23:59:59`;

        this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProduct));
      }
    }
    return await this.orderProductRepository.save(this.orderProductRepository.create(orderProduct));
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
    let startDate = new Date();
    let endDate = new Date();
    const todayDate = new Date();
    payload.startDtNull = false;
    payload.endDtNull = false;
    // Setting StartDate
    if (!payload.startDate) {
      if (!isNaN(Date.parse(payload.startDate.trim()))) {
        return 'Prodvide correct date formate';
      }
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      payload.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-1`;
      payload.startDtNull = true;
    }

    // Setting End Date
    if (!payload.endDate) {
      if (!isNaN(Date.parse(payload.endDate.trim()))) {
        return 'Prodvide correct date formate';
      }
      endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      payload.endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${lastDay} 23:59:59`;
      payload.endDtNull = true;
    }
    /**
     * **********************************End*************************************
     */
    const orderProduct = await this.orderProductRepository.findOne(id);

    const orderProductUpdate = {
      productDescription: payload.productDescription ? payload.productDescription : orderProduct.productDescription,
      cost: payload.cost ? payload.cost : orderProduct.cost,
      quantity: payload.quantity ? payload.quantity : orderProduct.quantity,
      recurrence: payload.recurrence,
      currentCharge: payload.currentCharge,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      startDtNull: payload.startDtNull,
      endDtNull: payload.endDtNull,
    }

    let ed = orderProduct.endDate;
    ed = new Date(new Date(ed.setDate(ed.getDate() + 1)).setHours(0, 0, 0, 0));
    const futureProducts = await this.orderProductRepository.find({
      where: {
        productName: orderProduct.productName,
        status: 0,
        endDate: MoreThan(ed),
      }
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id);
      }
    } else {
      for await (const product of futureProducts) {

        let futureOrderProduct = {
          productDescription: payload.productDescription,
          cost: payload.cost,
          quantity: payload.quantity,
          recurrence: payload.recurrence,
          currentCharge: payload.currentCharge,
          startDate: product.startDate,
          endDate: product.endDate,
          startDtNull: false,
          endDtNull: false
        }

        await this.orderProductRepository.update(product.id, futureOrderProduct);
      }
    }
    return await this.orderProductRepository.update(id, orderProductUpdate);
  }



  /**
   * @description This method will fetch the order products between given start date and end date
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async fetchOrderProductsBetweenDates(startDate: string, endDate: string, companyId: number) {

    return await this.orderProductRepository.createQueryBuilder("order_product")
      .where("order_product.companyId = :companyId", { companyId: companyId })
      .andWhere("order_product.endDate <= :endDate", { endDate: endDate + ' 23:59:59' })
      .andWhere("order_product.startDate >= :startDate", { startDate: startDate })
      .orderBy("order_product.updatedAt", 'DESC')
      .getRawMany();

  }

  /**
   * @description This method will Delete the order products.
   * @param id this is orderProduct Id
   * @returns  
   */
  async deleteOrderProduct(id: number) {

    const orderProduct = await this.orderProductRepository.findByIds([id]);
    const deleteProducts = await this.orderProductRepository.find({
      productName: orderProduct[0].productName,
      status: 0,
      startDate: MoreThanOrEqual(orderProduct[0].startDate),
    });
    for await (const product of deleteProducts) {
      await this.orderProductRepository.delete(product.id);
    }
    return await this.orderProductRepository.delete(id);
  }

}
