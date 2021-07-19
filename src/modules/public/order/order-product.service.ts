import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { equals } from 'class-validator';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ResidentCompany } from '../resident-company';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProduct } from './model/order-product.entity';

@Injectable()
export class OrderProductService {

  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(ResidentCompany)
    private readonly residentCompanyRepository: Repository<ResidentCompany>,
    private readonly moduleRef: ModuleRef
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
    if (orderProduct.startDate && isNaN(Date.parse(orderProduct.startDate))) {
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    // checking End Date
    if (orderProduct.endDate && isNaN(Date.parse(orderProduct.endDate))) {
      return { message: 'Prodvide correct date formate', status: 'error' };
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
    /**
     * BIOL-292
     */
    orderSave.groupId = orderSave.id;
    await this.orderProductRepository.update(orderSave.id,orderSave);

    if (orderProduct.recurrence) {
      /**
       * Add next 4 months Products
       */
      orderProduct.groupId = orderSave.id;
      orderProduct.productId = (orderProduct.manuallyEnteredProduct) ? orderSave.id : orderProduct.productId;
      await this.addFutureOrderProducts(orderProduct);
    }
    return { message: 'Added successfully', status: 'success' };
  }

  private async addFutureOrderProducts(orderProduct: any) {
    let futureOrderProduct = { ...orderProduct };
    for (let i = 1; i < 4; i++) {
      if (futureOrderProduct.month < 12) {
        futureOrderProduct.month = futureOrderProduct.month + 1;
      } else {
        futureOrderProduct.month = 1;
        futureOrderProduct.year = futureOrderProduct.year + 1;
      }
      futureOrderProduct.groupId = orderProduct.groupId;
      await this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProduct)).catch(err => {
        throw new HttpException({
          message: err.message
        }, HttpStatus.BAD_REQUEST);
      });
    }
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
    if (payload.startDate && isNaN(Date.parse(payload.startDate))) {
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    // Setting End Date
    if (payload.endDate && isNaN(Date.parse(payload.endDate))) {
      return { message: 'Prodvide correct date formate', status: 'error' };
    }
    /**
     * **********************************End*************************************
     */
    const orderProduct = await this.orderProductRepository.findOne(id).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.BAD_REQUEST);
    });

    payload.groupId = orderProduct.groupId;
    payload.manuallyEnteredProduct = orderProduct.manuallyEnteredProduct;
    const futureProducts = await this.orderProductRepository.find({
      where: {
        groupId: payload.groupId,
        status: 0,
        id: MoreThan(orderProduct.id)
      }
    }).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.NOT_MODIFIED);
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id).catch(err => {
          throw new HttpException({
            message: err.message
          }, HttpStatus.NOT_MODIFIED);
        });
      }
    } else {
      if (futureProducts.length == 0) {
        await this.addFutureOrderProducts(payload);
      } else {
        for await (const product of futureProducts) {
          let futureOrderProduct = { ...payload };
          futureOrderProduct.month = product.month;
          futureOrderProduct.groupId = product.groupId;
          await this.orderProductRepository.update(product.id, futureOrderProduct).catch(err => {
            throw new HttpException({
              message: err.message
            }, HttpStatus.NOT_MODIFIED);
          });
        }
      }
    }

    return await this.orderProductRepository.update(id, payload).catch(err => {
      throw new HttpException({
        message: err.message
      }, HttpStatus.NOT_MODIFIED);
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
      groupId: orderProduct.groupId,
      status: 0,
      id: MoreThan(orderProduct.id)
    });
    for await (const product of deleteProducts) {
      await this.orderProductRepository.delete(product.id);
    }
    return await this.orderProductRepository.delete(id);
  }
  /**
   * @description This method will fetch the all invoices based on month
   * @param month 
   * @returns 
   */
  async consolidatedInvoice(month: number, site: number) {
    const query = `select 
                    rc."id" as companyid, 
                    orp.id as orderId,
                    rc."companyName", 
                    orp."month", 
                    orp."productName", 
                    orp."productDescription", 
                    orp."cost", 
                    orp."quantity", 
                    orp."recurrence", 
                    orp."currentCharge", 
                    orp."startDate", 
                    orp."endDate" 
                  from 
                    resident_companies as rc 
                    LEFT JOIN (
                      select
                        orpd.id,
                        orpd."companyId", 
                        orpd."productName", 
                        orpd."month", 
                        orpd."productDescription", 
                        orpd."cost", 
                        orpd."quantity", 
                        orpd."recurrence", 
                        orpd."currentCharge", 
                        orpd."startDate", 
                        orpd."endDate" 
                      from 
                        order_product as orpd 
                      where 
                        (
                          orpd."month" = ${month} 
                          or orpd."month" isnull
                        )
                    ) as orp on orp."companyId" = rc."id" 
                  where 
                    rc."site" && ARRAY[${site}] :: int[] 
                    and rc."companyStatus" = '1' 
                  group by 
                    rc."id", 
                    orp."id",
                    rc."companyName",
                    orp."month", 
                    orp."productName", 
                    orp."productDescription", 
                    orp."cost", 
                    orp."quantity", 
                    orp."recurrence", 
                    orp."currentCharge", 
                    orp."startDate", 
                    orp."endDate" 
                  order by 
                    rc."companyName", 
                    orp."productName"`;
    return await this.residentCompanyRepository.query(query);
  }
}