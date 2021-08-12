import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderProductService } from 'modules/public/order';

@Injectable()
export class InvoiceSchedulerService {
  private readonly logger = new Logger(InvoiceSchedulerService.name);

  constructor(private readonly orderProductService: OrderProductService) { }


  //@Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
    this.orderProductService.updateRecurrenceInvoice();
  }
}