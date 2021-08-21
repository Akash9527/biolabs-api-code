import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailFrequency } from 'modules/public/enum/email-frequency-enum';
import { UsersService } from 'modules/public/user';
const { info, error, debug } = require('../../utils/logger');

@Injectable()
export class EmailSchedulerService {

  constructor(private readonly userService: UsersService) { }

  private readonly logger = new Logger(EmailSchedulerService.name);

  /**
   * Description: Scheduled to execute every Monday at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   * @description Scheduled to execute every Monday at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   */
  // @Cron(process.env.EVERY_MONDAY_AT_8_AM)
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleWeeklyEmailSchedule() {
    this.logger.debug(`Triggering weekly scheduled email to sponsor users`);
    try {
      info(`Triggering weekly scheduled email to sponsor users. ${process.env.EVERY_MONDAY_AT_8_AM}`, __filename, `handleWeeklyEmailSchedule()`);
      this.userService.handleSponsorEmailSchedule(EmailFrequency.WEEKLY);
      debug(`Triggered weekly scheduled email to sponsor users`, __filename, `handleWeeklyEmailSchedule()`);
    } catch (err) {
      this.logger.error(`${err.message}`);
      error(err.message, __filename, `handleWeeklyEmailSchedule()`);
    }
  }

  /**
   * Description: Scheduled to execute on 1st day of each month at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   * @description Scheduled to execute on 1st day of each month at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(process.env.EVERY_1ST_DAY_OF_MONTH_AT_8_AM)
  handleMonthlyEmailSchedule() {
    this.logger.debug(`Triggering monthly scheduled email to sponsor users`);
    try {
      info(`Triggering monthly scheduled email to sponsor users. ${process.env.EVERY_1ST_DAY_OF_MONTH_AT_8_AM}`, __filename, `handleMonthlyEmailSchedule()`);
      this.userService.handleSponsorEmailSchedule(EmailFrequency.MONTHLY);
    } catch (err) {
      this.logger.error(`${err.message}`);
      error(err.message, __filename, `handleMonthlyEmailSchedule()`);
    }
  }

  /**
   * Description: Scheduled to execute on 1st day of each quarter at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   * @description Scheduled to execute on 1st day of each quarter at 8 AM to send mail to Sponsor users with content of recently onboarded companies and recently graduated companies.
   */
  @Cron(process.env.EVERY_5_MINUTES)
  // @Cron(process.env.EVERY_QUARTER_1ST_DAY_AT_8_AM)
  handleQuarterlyEmailSchedule() {
    this.logger.debug(`Triggering quarterly scheduled email to sponsor users`);
    try {
      info(`Triggering quarterly scheduled email to sponsor users. ${process.env.EVERY_QUARTER_1ST_DAY_AT_8_AM}`, __filename, `handleQuarterlyEmailSchedule()`);
      this.userService.handleSponsorEmailSchedule(EmailFrequency.QUARTERLY);
    } catch (err) {
      this.logger.error(`${err.message}`);
      error(err.message, __filename, `handleQuarterlyEmailSchedule()`);
    }
  }
}