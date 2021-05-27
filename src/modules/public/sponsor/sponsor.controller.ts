import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ResidentCompanyService } from '../resident-company';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@Controller('sponsor')
@ApiTags('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService, 
    private readonly residentCompanyService: ResidentCompanyService) {}
 
/**
 * Description: This method is used to Add sponsor.
 * @description This method is used to Add sponsor.
 * @param payload it is a request query expects the payload of type ?any.
 */
 

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('global-data')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  dashboard() {
    return this.residentCompanyService.getResidentCompanyForSponsor();
  }

   
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('site-data')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' }) 
  dashboardBySite() {
    return this.residentCompanyService.getResidentCompanyForSponsorBySite();
  }

}
