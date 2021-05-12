import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Put,
  Req
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResidentCompanyService } from '.';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { Request } from 'express';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';

@Controller('api/resident-company')
@ApiTags('Resident Company')
export class ResidentCompanyController {
  constructor(
    private readonly residentCompanyService: ResidentCompanyService,
  ) { }

  /**
   * Description: This method is used to create a resident company.
   * @description This method is used to create a resident company.
   * @param payload it is a request body contains payload of type AddResidentCompanyPayload.
   */
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addResidentCompany(@Body() payload: AddResidentCompanyPayload, @Req() req: Request): Promise<any> {
    console.log('req === >', req.headers['origin']);
    type status_enum = '-1' | '0' | '1' | '99';
    const status: status_enum = "0";
    const pal = { ...payload, status: status };
    const user = await this.residentCompanyService.addResidentCompany(pal, req);
    return user;
  }

  /**
   * Description: This method is used to list the resident companies by get method.
   * @description This method is used to list the resident companies by get method.
   * @param payload it is a request query expects the payload of type ?any.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getResidentCompanies(@Query() params: any): Promise<any> {
    return this.residentCompanyService.getResidentCompanies(params);
  }
  
  /**
   * Description: This method is used to get a resident company information.
   * @description This method is used to get a resident company information.
   * @param id it is a request parameter expect a number value of resident company id.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getResidentCompany(@Param('id') id: number): Promise<any> {
    return this.residentCompanyService.getResidentCompany(id);
  }

  /**
   * Description: This method is used to upadte a resident company status.
   * @description This method is used to update a resident company status.
   * @param payload it is a request body contains payload of type UpdateResidentCompanyStatusPayload.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put('/update-status')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateResidentCompanyStatus(@Body() payload: UpdateResidentCompanyStatusPayload): Promise<any> {
    return this.residentCompanyService.updateResidentCompanyStatus(payload);
  }
}
