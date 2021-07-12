import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ResidentCompany } from '../resident-company';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProduct } from './model/order-product.entity';
const {error, warn, info,debug}=require("../../../utils/logger")
const {ResourceNotFoundException,InternalException,BiolabsException} = require('../../common/exception/biolabs-error');


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
    info("Add order product ProductName:"+orderProduct.productName,__filename,"addOrderProducts()")
    try{
    const todayDate = new Date();
    // checking StartDate
    if (orderProduct.startDate && isNaN(Date.parse(orderProduct.startDate))) {
      debug("Prodvide correct date format",__filename,"addOrderProducts()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    // checking End Date
    if (orderProduct.endDate && isNaN(Date.parse(orderProduct.endDate))) {
      debug("Prodvide correct date format",__filename,"addOrderProducts()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    //date Validation
    if ((orderProduct.startDate && ((new Date(orderProduct.startDate) < (new Date(`${todayDate.getMonth() + 1}/01/${todayDate.getFullYear()} 00:00:00`))) ||
      (orderProduct.startDate && orderProduct.endDate && (new Date(orderProduct.endDate) < new Date(orderProduct.startDate)))))) {
      debug("Please Select Valid Start Date and End Date",__filename,"addOrderProducts()")
      return { error: 'Please Select Valid Start Date and End Date' }
    }

    /**
     * **********************************End*************************************
     */
    // Set status "0" invoice not created
    orderProduct.status = 0;
    const orderSave = await this.orderProductRepository.save(this.orderProductRepository.create(orderProduct)).catch(err => {
      error(err.message,__filename,"addOrderProducts()");
      throw new InternalException(err.message);
    });

    if (orderProduct.recurrence) {
      /**
       * Add next 4 months Products
       */
      orderProduct.productId = (orderProduct.manuallyEnteredProduct) ? orderSave.id : orderProduct.productId;
      await this.addFutureOrderProducts(orderProduct);
    }
    return { message: 'Added successfully', status: 'success' };
  }catch(err){
    error(err.message,__filename,"addOrderProduct()");
      throw new InternalException(err.message);
  }
  }

  private async addFutureOrderProducts(orderProduct: any) {
    info("Add future order products",__filename,"addFutureOrderProducts()")
    let futureOrderProduct = { ...orderProduct };
    for (let i = 1; i < 4; i++) {
      if (futureOrderProduct.month < 12) {
        futureOrderProduct.month = futureOrderProduct.month + 1;
      } else {
        futureOrderProduct.month = 1;
        futureOrderProduct.year = futureOrderProduct.year + 1;
      }

      await this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProduct)).catch(err => {
        error(err.message,__filename,"addFutureOrderProducts()")
        throw new InternalException(err.message);
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

    info(`update order product by id: ${id}`,__filename,"updateOrderProduct()")
    /**
    * ***********************setting Default Dates***********************
    */
    // Setting StartDate
    if (payload.startDate && isNaN(Date.parse(payload.startDate))) {
      error("Prodvide correct date formate",__filename,"updateOrderProduct()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    // Setting End Date
    if (payload.endDate && isNaN(Date.parse(payload.endDate))) {
      error("Prodvide correct date formate",__filename,"updateOrderProduct()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }
    /**
     * **********************************End*************************************
     */
    const orderProduct = await this.orderProductRepository.findOne(id).catch(err => {
      error(err.message,__filename,"updateOrderProduct()")
      throw new BiolabsException(err.message);
    });
    debug(`order product: ${orderProduct.productId}`,__filename,"updateOrderProduct()");
    payload.productId = orderProduct.productId;
    payload.manuallyEnteredProduct = orderProduct.manuallyEnteredProduct;
    const futureProducts = await this.orderProductRepository.find({
      where: {
        productId: payload.productId,
        status: 0,
        month: MoreThan(payload.month),
      }
    }).catch(err => {
      error(err.message,__filename,"updateOrderProduct()")
      throw new BiolabsException(err.message);
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id).catch(err => {
          error(err.message,__filename,"updateOrderProduct()")
          throw new InternalException(err.message);
        });
      }
    } else {
      if (futureProducts.length == 0) {
        await this.addFutureOrderProducts(payload);
      } else {
        for await (const product of futureProducts) {
          let futureOrderProduct = { ...payload };
          futureOrderProduct.month = product.month;
          futureOrderProduct.productId = product.productId;
          await this.orderProductRepository.update(product.id, futureOrderProduct).catch(err => {
            error(err.message,__filename,"updateOrderProduct()");
            throw new InternalException(err.message);
          });
        }
      }
    }

    return await this.orderProductRepository.update(id, payload).catch(err => {
      error(err.message,__filename,"updateOrderProduct()");
      throw new InternalException(err.message);
    });
  }

  /**
   * @description This method will fetch the order products between given start date and end date
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async fetchOrderProductsBetweenDates(month: number, companyId: number) {
    info(`Fetch Order product between dates : ${month} companyId: ${companyId}`,__filename,"fetchOrderProductsBetweenDates()")
    try{
    return await this.orderProductRepository.createQueryBuilder("order_product")
      .where("order_product.companyId = :companyId", { companyId: companyId })
      .andWhere("order_product.month = :month", { month: month })
      .orderBy("order_product.updatedAt", 'DESC')
      .getRawMany();
    }catch(err){
      error("Error in fetching order products between dates",__filename,"fetchOrderProductBetweenDates()");
      throw new BiolabsException('Error in fetching order products between dates'+err.message);
    }

  }

  /**
   * @description This method will Delete the order products.
   * @param id this is orderProduct Id
   * @returns  
   */
  async deleteOrderProduct(id: number) {
    info(`Deleting Order product by Id: ${id}`,__filename,"deleteOrderProduct()")
    try{
    const orderProductArray = await this.orderProductRepository.findByIds([id]);
    const orderProduct = orderProductArray[0];
    debug(`order product: ${orderProduct.productId}`)
    const deleteProducts = await this.orderProductRepository.find({
      productId: orderProduct.productId,
      status: 0,
      month: MoreThanOrEqual(orderProduct.month)
    });
    for await (const product of deleteProducts) {
      await this.orderProductRepository.delete(product.id);
    }
    return await this.orderProductRepository.delete(id);
  }catch(err){
    error("Error in delete Order product",__filename,"deleteOrderProduct()");
    throw new InternalException(err.message);
  }
  }
  /**
   * @description This method will fetch the all invoices based on month
   * @param month 
   * @returns 
   */
  async consolidatedInvoice(month: number, site: number) {
    try{
    info(`Consolidated Invoice by month: ${month} site: ${site}`,__filename,"consolidatedInvoice()")
    const query = 'select rc.\"companyName\", rc.\"id\" as companyId, orp.\"productName\",'
      + ' orp.\"productDescription\", orp.\"cost\", orp.\"quantity\", '
      + ' orp.\"recurrence\", orp.\"currentCharge\", orp.\"startDate\", orp.\"endDate\" '
      + ' from resident_companies as rc'
      + ' LEFT OUTER JOIN order_product as orp on orp.\"companyId\" = rc.\"id\"'
      + ' where rc.\"site\" && ARRAY[' + site + ']::int[]'
      + ' and (orp.\"month\"=' + month + ' or orp."month" isnull )'
      + ' and rc.\"companyStatus\" = \'1\' '
      + ' group by rc.\"id\", rc.\"companyName\", orp.\"companyId\", orp.\"productName\",'
      + ' orp.\"productDescription\", orp.\"cost\", orp.\"quantity\", '
      + ' orp.\"recurrence\", orp.\"currentCharge\", orp.\"startDate\", orp.\"endDate\" '
      + ' order by rc.\"companyName\" ,  orp.\"productName\"';
      debug(`query: ${query}`,__filename,"consolidatedInvoice()")
    return await this.residentCompanyRepository.query(query);
    }catch(err){
      error("Error in find consolidated Invoice",__filename,"consolidatedInvoice()");
      throw new BiolabsException('Error in find consolidated Invoice');
    }
  }
}