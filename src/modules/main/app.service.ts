import { Injectable } from '@nestjs/common';
import { ConfigService } from './../config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) { }

  /**
   * Description: This method will return the app url from system enviourment.
   * @description This method will return the app url from system enviourment.
   */
  root(): string {
    return process.env.APPSETTING_APP_URL;
  }
}