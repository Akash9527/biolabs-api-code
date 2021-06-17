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
    const todayDate = new Date();
    /**
     * ***********************setting Default Dates***********************
     */

    // Setting StartDate
    if (!orderProduct.startDate) {
      orderProduct.startDate = '01/01/2021';
    } else {
      orderProduct.startDate = orderProduct.startDate;
    }
    // Setting End Date
    if (!orderProduct.endDate) {
      orderProduct.endDate = '12/31/9999';
    } else {
      orderProduct.endDate = orderProduct.endDate + ' 23:59:59';
    }

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
        let sd = new Date(futureOrderProduct.startDate);
        let ed = new Date(new Date(futureOrderProduct.endDate).setDate(1));

        const startDT = new Date(sd.setMonth(sd.getMonth() + i));
        const endDT = new Date(ed.setMonth(ed.getMonth() + i));
        const lastDay = new Date(endDT.getFullYear(), endDT.getMonth() + 1, 0).getDate();

        futureOrderProduct.currentCharge = true;
        futureOrderProduct.startDate = `${startDT.getFullYear()}-${startDT.getMonth() + 1}-01`;
        futureOrderProduct.endDate = `${endDT.getFullYear()}-${endDT.getMonth() + 1}-${lastDay} 23:59:59`;

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
    let startDate = new Date('01/01/2021');
    let endDate = new Date('12/31/9999');

    // Setting StartDate
    if (payload.startDate) {
      startDate = new Date(payload.startDate);
    } else {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    }

    // Setting End Date
    if (payload.endDate) {
      endDate = new Date(payload.endDate);
    } else {
      endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59);
    }

    const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();

    payload.startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    payload.endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${lastDay} 23:59:59`;

    /**
     * **********************************End*************************************
     */

    const orderProduct = await this.orderProductRepository.findOne(id);
    orderProduct.productDescription = payload.productDescription ? payload.productDescription : orderProduct.productDescription;
    orderProduct.cost = payload.cost ? payload.cost : orderProduct.cost;
    orderProduct.recurrence = payload.recurrence;
    orderProduct.currentCharge = payload.currentCharge;
    orderProduct.startDate = payload.startDate ? new Date(payload.startDate) : orderProduct.startDate;
    orderProduct.endDate = payload.endDate ? new Date(payload.endDate) : orderProduct.endDate;
    orderProduct.quantity = payload.quantity ? payload.quantity : orderProduct.quantity;

    let ed = orderProduct.endDate;
    ed = new Date(ed.setDate(ed.getDate() + 1));

    const futureProducts = await this.orderProductRepository.find({
      productName: orderProduct.productName,
      status: 0,
      endDate: MoreThan(ed),
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id);
      }
    } else {
      for (let i = 0; i < futureProducts.length; i++) {
        let futureOrderProduct = { ...payload };
        const product = futureProducts[i];
        const productData = await this.orderProductRepository.findOne(product.id);
        const st = productData['startDate'];
        const ed = new Date(new Date(productData['endDate']).setDate(1));

        const lastDay = new Date(ed.getFullYear(), ed.getMonth() + 1, 0).getDate();
        futureOrderProduct.startDate = `${st.getFullYear()}-${st.getMonth() + 1}-${st.getDate()}`;
        futureOrderProduct.endDate = `${ed.getFullYear()}-${ed.getMonth() + 1}-${lastDay} 23:59:59`;

        await this.orderProductRepository.update(product.id, this.orderProductRepository.create(futureOrderProduct));
      }
    }
    return await this.orderProductRepository.update(id, this.orderProductRepository.create(payload));
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
      .andWhere("order_product.endDate <= :endDate", {  endDate: endDate+' 23:59:59' })
      .andWhere("order_product.startDate >= :startDate", { startDate: startDate })
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
      status : 0,
      startDate : MoreThanOrEqual(orderProduct[0].startDate),
    });
    for await (const product of deleteProducts) {
      await this.orderProductRepository.delete(product.id);
    }
    return await this.orderProductRepository.delete(id);
  }

}
