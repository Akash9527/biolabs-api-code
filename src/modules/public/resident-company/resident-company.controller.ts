import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResidentCompanyService } from '.';
import { AddSpaceChangeWaitlistDto } from '../dto/add-space-change-waitlist.dto';
import { UpdateSpaceChangeWaitlistDto } from '../dto/update-space-change-waitlist.dto';
import { UpdateWaitlistPriorityOrderDto } from '../dto/update-waitlist-priority-order.dto';
import { UpdateWaitlistRequestStatusDto } from '../dto/update-waitlist-request-status.dto';
import { AddNotesDto } from './add-notes.dto';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { UpdateNotesDto } from './update-notes.dto';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';
const { info } = require("../../../utils/logger")

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
   * Description: This method returns some specific fields of Resident Company by residentCompanyId.
   * @description This method returns some specific fields of Resident Company by residentCompanyId.
   * @param residentCompanyId 
   * @param req Request object
   * @returns Return some specific fields on Resident Company
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/forwaitlist/:residentCompanyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getResidentCompanySpecificFieldsById(@Param('residentCompanyId') residentCompanyId: number, @Request() req): Promise<any> {
    info(`Get some specific fields of Resident Company by company Id: ${residentCompanyId}`, __filename, `getResidentCompanySpecificFieldsById()`);
    return this.residentCompanyService.getResidentCompanySpecificFieldsById(residentCompanyId, req);
  }

  /**
  * Description: This method is used to get a resident company information for sponsor dashboard.
  * @description This method is used to get a resident company information  for sponsor dashboard.
  * @param id it is a request parameter expect a number value of resident company id.
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
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
    if (payload.companyStatusChangeDate) {
      payload.companyStatusChangeDate = new Date();
    }
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
  async updateResidentCompany(@Body() payload: UpdateResidentCompanyPayload, @Request() req): Promise<any> {
    return this.residentCompanyService.updateResidentCompany(payload, req);
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
  async getResidentCompany(@Param('id') id: number, @Request() req?): Promise<any> {
    return this.residentCompanyService.getResidentCompany(id, req);
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
    return await this.residentCompanyService.softDeleteNote(id);
  }
  /**
    * Description: This method is used to update notes in the application.
    * @description This method is used to update a notes in the application.
    * @param payload it is a request body contains payload of type UpdateNotesDto.
    * @param id it is a request parameter expect a number value of note id.
    */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put('notes/:id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateNote(@Body() payload: UpdateNotesDto, @Param('id') id: number): Promise<any> {
    return await this.residentCompanyService.updateNote(payload, id);
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
  async softDeleteMember(@Param('id') id: number, @Param('type') type: string): Promise<any> {
    const member = await this.residentCompanyService.softDeleteMember(id, type);
    return member;
  }

  /**
  * Description: This method returns stages of technology by siteId and companyId
  * @description This method returns stages of technology by siteId and companyId
  * @param siteId The site id
  * @returns stages of technology
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('stage-technology/:siteId/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStageOfTechnology(@Param('siteId') siteId: number, @Param('companyId') companyId: number): Promise<any> {
    info(`Get stages of technology by siteId: ${siteId} and companyId: ${companyId}`, __filename, `getStageOfTechnology()`);
    return this.residentCompanyService.getStagesOfTechnologyBySiteId(siteId, companyId);
  }

  /**
   * Description: This method returns fundings by siteId and companyId
   * @description This method returns fundings by siteId and companyId
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns fundings
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('funding/:siteId/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getFundingBySiteIdAndCompanyId(@Param('siteId') siteId: number, @Param('companyId') companyId: number): Promise<any> {
    info(`Get fundings by siteId: ${siteId} and companyId: ${companyId}`, __filename, `getFundingBySiteIdAndCompanyId()`);
    return this.residentCompanyService.getFundingBySiteIdAndCompanyId(siteId, companyId);
  }

  /**
   * Description: This method returns started with biolabs date
   * @description This method returns started with biolabs date
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns started with biolabs date
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('startedWithBiolabs/:siteId/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getstartedWithBiolabs(@Param('siteId') siteId: number, @Param('companyId') companyId: number): Promise<any> {
    return this.residentCompanyService.getstartedWithBiolabs(siteId, companyId);
  }
  /**
  * Description: This method returns current month fee details.
  * @description This method returns current month fee details.
  * @param siteId The Site id
  * @param companyId The Company id
  * @returns current month fee details
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('financialfees/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getFinancialFees(@Param('companyId') companyId: number): Promise<any> {
    return this.residentCompanyService.getFinancialFees(companyId);
  }

  /**
   * Description: This method returns latest feeds.
   * @description This method returns latest feeds.
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns current month fee details
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('feeds/:siteId/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getFeeds(@Param('siteId') siteId: number, @Param('companyId') companyId: number): Promise<any> {
    return this.residentCompanyService.getFeeds(siteId, companyId);
  }

  /**
   * Description: This method returns data to visualize timeline data on graph.
   * @description This method returns data to visualize timeline data on graph.
   * @param companyId The Company id.
   * @returns timeline data.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('timeline/analysis/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTimelineAnalysis(@Param('companyId') companyId: number) {
    return this.residentCompanyService.timelineAnalysis(companyId);
  }
  /**
   * Description: This method returns companySize Quarterly.
   * @description This method returns current month fee details.
   * @param companyId The Company id
   * @returns current month fee details.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('companysizeanalysis/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCompanySizeQuartly(@Param('companyId') companyId: number): Promise<any> {
    return this.residentCompanyService.getCompanySizeQuartly(companyId);
  }

  /**
  * @description BIOL-275: Add space waitlist entry
  * @param payload
  * @param req
  * @returns
  */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post("/spacechangewaitlist")
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiHeader({
    name: 'x-site-id',
    description: 'Selected site ids array',
  })
  async addSpaceChangeWaitlist(@Body() payload: AddSpaceChangeWaitlistDto, @Request() req): Promise<any> {
    info(`Add Space Change Waitlist record for resident company id: ${payload.residentCompanyId} and site: ${req.user.site_id} `, __filename, `addSpaceChangeWaitlist()`);
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return await this.residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
  }

  /**
   * Description: BIOL-275 Get Space Change Waitlist by status,siteId and companyId
   * @param status array of status (0,1,2)
   * @param req Request object
   * @param companyId id of the company
   * @returns list of Space Change Waitlist
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/spacechangewaitlist/param?')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSpaceChangeWaitlist(@Query('status') status: number[], @Request() req, @Query('companyId') companyId: number): Promise<any> {
    info(`Get Space Change Waitlist records by request status: ${status}, site: ${req.user.site_id} and company id: ${companyId} `, __filename, `getSpaceChangeWaitlist()`);
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return this.residentCompanyService.getSpaceChangeWaitListByStatusSiteIdAndCompanyId(status, siteIdArr, companyId, req);
  }

  /**
   * Description: BIOL-275: Method to return SpaceChangeWaitList object by id.
   * @description BIOL-275: Get space change waitlist by id.
   * @param id of SpaceChangeWaitList
   * @returns object of SpaceChangeWaitList
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/spacechangewaitlist/:id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSpaceChangeWaitlistById(@Param('id') id: number): Promise<any> {
    info(`Get Space Change Waitlist by id: ${id} `, __filename, `getSpaceChangeWaitlistById()`);
    return this.residentCompanyService.getSpaceChangeWaitListById(id);
  }

  /**
   * Description: BIOL-275: Get items for space change waitlist by siteId and companyId.
   * @description BIOL-275: Get items for space change waitlist by siteId and companyId.
   * @param companyId Id of Resident Company
   * @param req Request object
   * @returns Return items to show in a waitlist
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/spacechangewaitlist/items/:companyId')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getItemsForSpaceChangeWaitlist(@Param('companyId') companyId: number, @Request() req): Promise<any> {
    info(`Get items for Space Change Waitlist by resident company id: ${companyId} `, __filename, `getItemsForSpaceChangeWaitlist()`);
    return this.residentCompanyService.getSpaceChangeWaitlistItems(companyId, req);
  }

  /**
   * Updates the priority order of Open space change wait list.
   * @description Updates the priority order of Open space change wait list.
   * @param payload it is a request body contains new order of Space Change Waitlist Ids.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put('/spacechangewaitlist/priorityorder')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateWaitlistPriorityOrder(@Body() payload: UpdateWaitlistPriorityOrderDto): Promise<any> {
    info(`Update Space Change Waitlist priority order by ids: ${payload.spaceChangeWaitlistIds} `, __filename, `updateWaitlistPriorityOrder()`);
    return this.residentCompanyService.updateSpaceChangeWaitlistPriorityOrder(payload);
  }

  /**
   * Description: Update Space Change Waitlist with items, update Resident Company details, update Resident Company history.
   * @description Update Space Change Waitlist with items, update Resident Company details, update Resident Company history.
   * @param payload it is a request body contains new order of Space Change Waitlist Ids.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put('/spacechangewaitlist')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSpaceChangeWaitlist(@Body() payload: UpdateSpaceChangeWaitlistDto, @Request() req): Promise<any> {
    info(`Update Space Change Waitlist record by id: ${payload.spaceChangeWaitlistId} `, __filename, `updateSpaceChangeWaitlist()`);
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    return this.residentCompanyService.updateSpaceChangeWaitlist(payload, siteIdArr, req);
  }

  /**
   * Description: Updates request status of Space Change Waitlist.
   * @description Updates request status of Space Change Waitlist.
   * @param payload payload object with id and status fields
   * @returns response with status and message fields
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put('/spacechangewaitlist/status')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSpaceChangeWaitlistStatus(@Body() payload: UpdateWaitlistRequestStatusDto, @Request() req): Promise<any> {
    info(`Update Space Change Waitlist status by id: ${payload.id} `, __filename, `updateSpaceChangeWaitlistStatus()`);
    return this.residentCompanyService.updateSpaceChangeWaitlistStatus(payload, req);
  }

}