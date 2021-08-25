import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ResidentCompany, ResidentCompanyService } from '../resident-company';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProduct } from './model/order-product.entity';
import { Product } from './model/product.entity';
const { error, info, debug } = require("../../../utils/logger")
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');

@Injectable()
export class OrderProductService {

  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ResidentCompany)
    private readonly residentCompanyRepository: Repository<ResidentCompany>,
    private readonly moduleRef: ModuleRef,
    private readonly residentCompanyService: ResidentCompanyService
  ) { }

  /**
   * Description: This method will create the new order product details.
   * @description This method will create the new order product details.
   * @param payload object of AddOrderDto.
   * @return saved order product object
   */
  async addOrderProduct(orderProduct: CreateOrderProductDto) {
    info("Add order product ProductName:" + orderProduct.productName, __filename, "addOrderProducts()")
    try {
      let submittedDate = orderProduct.submittedDate;
      delete orderProduct.submittedDate;
      const todayDate = new Date();
      // checking StartDate
      if (orderProduct.startDate && isNaN(Date.parse(orderProduct.startDate))) {
        debug("Prodvide correct date format", __filename, "addOrderProducts()")
        return { message: 'Prodvide correct date formate', status: 'error' };
      }

      // checking End Date
      if (orderProduct.endDate && isNaN(Date.parse(orderProduct.endDate))) {
        debug("Prodvide correct date format", __filename, "addOrderProducts()")
        return { message: 'Prodvide correct date formate', status: 'error' };
      }

      //date Validation
      if ((orderProduct.startDate && ((new Date(orderProduct.startDate) < (new Date(`${todayDate.getMonth() + 1}/01/${todayDate.getFullYear()} 00:00:00`))) ||
        (orderProduct.startDate && orderProduct.endDate && (new Date(orderProduct.endDate) < new Date(orderProduct.startDate)))))) {
        debug("Please Select Valid Start Date and End Date", __filename, "addOrderProducts()")
        return { error: 'Please Select Valid Start Date and End Date' }
      }

      /**
       * **********************************End*************************************
       */
      // Set status "0" invoice not created
      orderProduct.status = 0;
      const orderSave = await this.orderProductRepository.save(this.orderProductRepository.create(orderProduct)).catch(err => {
        error(err.message, __filename, "addOrderProducts()");
        throw new InternalException(err.message);
      });
      /**
       * BIOL-292
       */
      orderProduct.groupId = orderSave.id;
      orderProduct.productId = (orderProduct.manuallyEnteredProduct) ? orderSave.id : orderProduct.productId;
      const product = await this.productRepository.findOne(orderProduct.productId);
      orderProduct.productTypeId = (product && product.productType) ? product.productType.id : null;
      await this.orderProductRepository.update(orderSave.id, orderProduct);

      if (orderProduct.recurrence) {
        /**
         * Add next 4 months Products
         */
        orderProduct.submittedDate=submittedDate;
        await this.addFutureOrderProducts(orderProduct);
      }
      return { message: 'Added successfully', status: 'success' };
    } catch (err) {
      error(err.message, __filename, "addOrderProduct()");
      throw new InternalException(err.message);
    }
  }

  private async addFutureOrderProducts(orderProduct: any) {
    info("Add future order products", __filename, "addFutureOrderProducts()")
    let futureOrderProduct = { ...orderProduct };
    const todayDate = new Date();
    let today = new Date(`${todayDate.getMonth() + 1}/01/${todayDate.getFullYear()} 00:00:00`);
    let diffMonthsToCurrent = this.monthDiff(today, new Date(futureOrderProduct.startDate ? 
      futureOrderProduct.startDate : futureOrderProduct.submittedDate));
    let recursiveLength = 4 - (Number(diffMonthsToCurrent) - 1);
    for (let i = 1; i < recursiveLength; i++) {
      if (futureOrderProduct.month < 12) {
        futureOrderProduct.month = futureOrderProduct.month + 1;
      } else {
        futureOrderProduct.month = 1;
        futureOrderProduct.year = futureOrderProduct.year + 1;
      }
      futureOrderProduct.groupId = orderProduct.groupId;
      await this.orderProductRepository.save(this.orderProductRepository.create(futureOrderProduct)).catch(err => {
        error(err.message, __filename, "addFutureOrderProducts()")
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

    info(`update order product by id: ${id}`, __filename, "updateOrderProduct()")
    /**
    * ***********************setting Default Dates***********************
    */
    // Setting StartDate
    if (payload.startDate && isNaN(Date.parse(payload.startDate))) {
      error("Prodvide correct date formate", __filename, "updateOrderProduct()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }

    // Setting End Date
    if (payload.endDate && isNaN(Date.parse(payload.endDate))) {
      error("Prodvide correct date formate", __filename, "updateOrderProduct()")
      return { message: 'Prodvide correct date formate', status: 'error' };
    }
    /**
     * **********************************End*************************************
     */
    const orderProduct = await this.orderProductRepository.findOne(id).catch(err => {
      error(err.message, __filename, "updateOrderProduct()")
      throw new BiolabsException(err.message);
    });
    debug(`order product: ${payload.productId}`, __filename, "updateOrderProduct()");
    const productId = (payload.productId) ? payload.productId : orderProduct.id;
    const product = await this.productRepository.findOne(productId);
    payload.productTypeId = (product && product.productType) ? product.productType.id : null;
    payload.status = orderProduct.status;
    payload.groupId = orderProduct.groupId;
    payload.productId = productId;
    const futureProducts = await this.orderProductRepository.find({
      where: {
        groupId: payload.groupId,
        status: 0,
        id: MoreThan(orderProduct.id)
      }
    }).catch(err => {
      error(err.message, __filename, "updateOrderProduct()")
      throw new BiolabsException(err.message);
    });
    if (!payload.recurrence) {
      for await (const product of futureProducts) {
        await this.orderProductRepository.delete(product.id).catch(err => {
          error(err.message, __filename, "updateOrderProduct()")
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
          futureOrderProduct.groupId = product.groupId;
          await this.orderProductRepository.update(product.id, futureOrderProduct).catch(err => {
            error(err.message, __filename, "updateOrderProduct()");
            throw new InternalException(err.message);
          });
        }
      }
    }

    return await this.orderProductRepository.update(id, payload).catch(err => {
      error(err.message, __filename, "updateOrderProduct()");
      throw new InternalException(err.message);
    });
  }

  /**
   * @description This method will fetch the order products between given start date and end date
   * @param startDate 
   * @param endDate 
   * @returns 
   */
  async fetchOrderProductsBetweenDates(month: number, year: number, companyId: number, siteIdArr: number[]) {
    info(`Fetch Order product between dates : ${month} companyId: ${companyId}`, __filename, "fetchOrderProductsBetweenDates()");
    const residentCompany: any = await this.residentCompanyRepository.findOne(companyId);
    if (residentCompany) {
      info(`Fetched resident company by id : ${residentCompany.id}`, __filename, "fetchOrderProductsBetweenDates()");
      this.residentCompanyService.checkIfValidSiteIds(siteIdArr, residentCompany.site);
    } else {
      error(`Resident company not found by id: ${companyId}`, __filename, `fetchOrderProductsBetweenDates()`);
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
    try {
      return await this.orderProductRepository.createQueryBuilder("order_product")
        .where("order_product.companyId = :companyId", { companyId: companyId })
        .andWhere("order_product.month = :month", { month: month })
        .andWhere("order_product.year = :year", { year: year })
        .orderBy("order_product.updatedAt", 'DESC')
        .getRawMany();
    } catch (err) {
      error("Error in fetching order products between dates", __filename, "fetchOrderProductBetweenDates()");
      throw new BiolabsException('Error in fetching order products between dates', err.message);
    }
  }

  /**
   * @description This method will Delete the order products.
   * @param id this is orderProduct Id
   * @returns  
   */
  async deleteOrderProduct(id: number) {
    info(`Deleting Order product by Id: ${id}`, __filename, "deleteOrderProduct()")
    try {
      const orderProductArray = await this.orderProductRepository.findByIds([id]);
      const orderProduct = orderProductArray[0];
      debug(`order product: ${orderProduct.productId}`)
      const deleteProducts = await this.orderProductRepository.find({
        groupId: orderProduct.groupId,
        status: 0,
        id: MoreThan(orderProduct.id)
      });
      for await (const product of deleteProducts) {
        await this.orderProductRepository.delete(product.id);
      }
      return await this.orderProductRepository.delete(id);
    } catch (err) {
      error("Error in delete Order product", __filename, "deleteOrderProduct()");
      throw new InternalException(err.message);
    }
  }
  /**
   * @description This method will fetch the all invoices based on month
   * @param month 
   * @returns 
   */
  async consolidatedInvoice(month: number, year: number, site: number) {
    try {
      info(`Consolidated Invoice by month: ${month}, year ${year} site: ${site}`, __filename, "consolidatedInvoice()");
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
                        and orpd."year" = ${year}
                        and orpd."currentCharge" = true
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
    } catch (err) {
      error("Error in find consolidated Invoice", __filename, "consolidatedInvoice()");
      throw new BiolabsException('Error in find consolidated Invoice');
    }
  }

  async getDistinctGroupId() {
    try {
      info(`getDistinctGroupId `, __filename, "getDistinctGroupId()");
      const query = `select distinct("groupId") from order_product 
      where "recurrence" = true and status = 0
      and (to_char(DATE (year || '-' || month || '-01'), 'YYYY-MM-DD')::date + (1 || ' month')::INTERVAL) >= CURRENT_DATE`;
      return await this.orderProductRepository.query(query);
    } catch (err) {
      error("Error in find getDistinctGroupId from order_product", __filename, "getDistinctGroupId()");
      throw new BiolabsException('Error in find getDistinctGroupId Invoice');
    }
  }

  async getMaxMonthOrderProductByGroupId(groupId: number) {
    try {
      info(`maxMonthByGroupId groupId : ${groupId}`, __filename, "maxMonthByGroupId()");
      const query = `select id , to_char(DATE (month || '/01/' || year), 'MM/DD/YYYY') as maxDate
                    from order_product where "groupId" = ${groupId}
                    order by to_char(DATE (month || '/01/' || year), 'MM/DD/YYYY') desc limit 1`;
      return await this.orderProductRepository.query(query);
    } catch (err) {
      error("Error in find maxMonthByGroupId from order_product", __filename, "maxMonthByGroupId()");
      throw new BiolabsException('Error in find maxMonthByGroupId Invoice');
    }
  }

  getFurtureMonthDate() {
    const date = new Date()
    return new Date(date.setMonth(date.getMonth() + 4));
  }


  monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  async updateRecurrenceInvoice() {

    let groupIds = await this.getDistinctGroupId();

    for (const groupId of groupIds) {
      let orderProducts = await this.getMaxMonthOrderProductByGroupId(groupId.groupId);

      if (orderProducts && orderProducts.length > 0) {
        const orderProduct = orderProducts[0];
        const orderProductMaxDt = new Date(orderProduct.maxdate);
        const futureDate = this.getFurtureMonthDate();

        if (this.monthDiff(new Date(orderProductMaxDt.getFullYear(), orderProductMaxDt.getMonth()),
          new Date(futureDate.getFullYear(), futureDate.getMonth())) > 0) {

          const orderProductDB = await this.orderProductRepository.findOne(orderProduct.id);
          // Set status "0" invoice not created
          orderProductDB.status = 0;
          //deleting auto generated keys
          delete orderProductDB.id;
          delete orderProductDB.createdAt;
          delete orderProductDB.updatedAt;

          this.addFutureOrderProducts(orderProductDB);
        }
      }
    }
    return 'add-invoice-future-months process is running it will take few mins...!';
  }
}