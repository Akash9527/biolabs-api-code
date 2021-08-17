import { Get, Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  /**
   * Description: This method will return the home page response.
   * @description This method will return the home page response.
   */
  @Get()
  root(): any {
    return 'Hello from Biolabs';
  }
}
