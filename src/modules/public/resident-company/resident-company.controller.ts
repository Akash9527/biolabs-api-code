import { Controller, UseGuards, Get, Param, Post, Body, Query, Put, Request, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResidentCompanyService } from '.';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { AddNotesDto } from './add-notes.dto';

@Controller('api/resident-company')
@ApiTags('Resident Company')
export class ResidentCompanyController {
  constructor(
    private readonly residentCompanyService: ResidentCompanyService
  ) { }

  /**
   * Description: This method is used to create a resident company.
   * @description This method will create the new resident companies and sends email associate site_admins.
   * @param payload it is a request body contains payload of type AddResidentCompanyPayload.
   */
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addResidentCompany(@Body() payload: AddResidentCompanyPayload, @Request() req): Promise<any> {
    type status_enum = '-1' | '0' | '1' | '99';
    const status: status_enum = '1';
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
  @ApiHeader({
    name: 'x-site-id',
    description: 'Selected site ids array',
  })
  async getResidentCompanies(@Query() params: any, @Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    // removing site filter for sponsor user BIOL-224 BIOL-225
    if (req.user && req.user.role == 3) {
      siteIdArr = [];
    }
    return this.residentCompanyService.getResidentCompanies(params, siteIdArr);
  }

  /**
  * Description: This method is used to get a resident company information for sponsor dashboard.
  * @description This method is used to get a resident company information  for sponsor dashboard.
  * @param id it is a request parameter expect a number value of resident company id.
  */

  @Get('/dashboard')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  async getResidentCompanyForSponsor(): Promise<any> {
    return this.residentCompanyService.getResidentCompanyForSponsor();
  }

  /**
   * Description: This method is used to update a resident company status.
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

  /**
   * Description: This method is used to upadte a resident company status.
   * @description This method is used to update a resident company status.
   * @param payload it is a request body contains payload of type UpdateResidentCompanyStatusPayload.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateResidentCompany(@Body() payload: UpdateResidentCompanyPayload): Promise<any> {
    return this.residentCompanyService.updateResidentCompany(payload);
  }

  /**
   * Description: This method is used to global search for resident companies.
   * @description This method is used to global search for resident companies.
   * @param payload it is a request body contains payload of type UpdateResidentCompanyStatusPayload.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/search')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiHeader({
    name: 'x-site-id',
    description: 'Selected site ids array',
  })

  async gloabalSearchCompanies(@Query() params: SearchResidentCompanyPayload, @Request() req): Promise<any> {
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return this.residentCompanyService.gloabalSearchCompanies(params, siteIdArr);
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
   * Description: This method is used to get a notes information by companyId.
   * @description This method is used to get a notes information by companyId.
   * @param companyId it is a request parameter expect a number value of companyId.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('notes/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNoteByCompanyId(@Param('companyId') companyId: number): Promise<any> {
    return this.residentCompanyService.getNoteByCompanyId(companyId);
  }

  /**
     * Description: This method is used to create a new note in the application.
     * @description This method is used to create a new note in the application.
     * @param payload it is a request body contains payload of type AddNotesPayload.
     * @param req this parameter contains the header of the request api.
     */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post("/notes")
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addNote(@Body() payload: AddNotesDto, @Request() req) {
    return await this.residentCompanyService.addNote(payload, req);
  }

  /**
  * Description: This method is used to soft delete a notes in the application.
  * @description This method is used to soft delete a notes in the application.
  * @param id it is a request parameter expect a number value of note id.
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('notes/:id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async softDeleteNote(@Param('id') id: number): Promise<any> {
    const notes = await this.residentCompanyService.softDeleteNote(id);
    return notes;
  }

  /**
  * Description: This method is used to soft delete the list(for advisors,managements,technicals).
  * @description This method is used to soft delete the list(for advisors,managements,technicals).
  * @param id it is a request parameter expect a number value of member id.
  * @param type it is a request parameter expect a string value of list type(for advisors,managements,technicals).
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('member-list/:id/:type')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async softDeleteList(@Param('id') id: number, @Param('type') type: string): Promise<any> {
    const member = await this.residentCompanyService.softDeleteMember(id, type);
    return member;
  }
}