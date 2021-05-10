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
  
  @Get('biolabs-source')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBiolabsSource(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getBiolabsSource(params);
  }
  
  @Get('fundings')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFundings(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getFundings(params);
  }
  
  @Get('modality')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getModalities(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getModalities(params);
  }
  
  @Get('technology-stage')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTechnologyStages(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getTechnologyStages(params);
  }
  
  @Get('industries')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIndustries(@Query() params:MasterPayload): Promise<any> {
    return this.masterService.getIndustries(params);
  }
  
}
