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
  ) { }

  /**
   * Description: This method is used to list the sites by get method.
   * @description This method is used to list the sites by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('sites')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSites(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getSites(params);
  }

  /**
   * Description: This method is used to list the roles by get method.
   * @description This method is used to list the roles by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('roles')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRoles(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getRoles(params);
  }

  /**
   * Description: This method is used to list the categories by get method.
   * @description This method is used to list the categories by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('category')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCategories(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getCategories(params);
  }

  /**
   * Description: This method is used to list the biolabs sources by get method.
   * @description This method is used to list the biolabs sources by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('biolabs-source')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBiolabsSource(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getBiolabsSource(params);
  }

  /**
   * Description: This method is used to list the fundings by get method.
   * @description This method is used to list the fundings by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('fundings')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFundings(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getFundings(params);
  }

  /**
   * Description: This method is used to list the modalities by get method.
   * @description This method is used to list the modalities by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('modality')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getModalities(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getModalities(params);
  }

  /**
   * Description: This method is used to list the technology stages by get method.
   * @description This method is used to list the technology stages by get method.
   * @param payload it is a request query expects the payload of type MasterPayload.
   */
  @Get('technology-stage')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTechnologyStages(@Query() params: MasterPayload): Promise<any> {
    return this.masterService.getTechnologyStages(params);
  }

  /**
   * Description: This method is used to list the company status.
   * @description This method is used to list the company status.
   */
   @Get('company-status')
   @ApiResponse({ status: 200, description: 'Successful Response' })
   @ApiResponse({ status: 401, description: 'Unauthorized' })
   async getCompanyStatus(): Promise<any> {
     return this.masterService.getCompanyStatus();
   }

  /**
   * Description: This method is used to list the user type.
   * @description This method is used to list the user type.
   */
  @Get('user-types')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserTypes(): Promise<any> {
    return this.masterService.getUserTypes();
  }

}
