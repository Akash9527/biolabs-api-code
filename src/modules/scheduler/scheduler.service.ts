import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  // @Cron(process.env.APPSETTING_SCHEDULERTIME)
  // createInvoice() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}