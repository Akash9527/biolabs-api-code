import { Injectable } from '@nestjs/common';
import { ConfigService } from './../config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  root(): string {
    return process.env.APPSETTING_APP_URL;
  }
}
