import { Injectable, Logger } from '@nestjs/common';
//import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EmailSchedulerService {
  private readonly logger = new Logger(EmailSchedulerService.name);

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron() {
  //   this.logger.debug('Called every 30 seconds');
  // }
}