import {
  Controller,
  UseGuards,
  Get,
  Request,
  Param,
  Query
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MasterService, MasterPayload } from '.';


@Controller('api/master')
@ApiTags('Master')
export class MasterController {
  constructor(
    private readonly masterService: MasterService
  ) {}

  @Get('sites')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSites(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getSites(params);
  }
  
  @Get('roles')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoles(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getRoles(params);
  }
  
  @Get('category')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCategories(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getCategories(params);
  }
  
}
