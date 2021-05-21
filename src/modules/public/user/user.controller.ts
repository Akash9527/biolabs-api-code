import { Controller, UseGuards, Get, Param, Post, Body, Delete, Query, Put, Req } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '.';
import { AddUserPayload } from './add-user.payload';
import { UpdateUserPayload } from './update-user.payload';
import { ListUserPayload } from './list-user.payload';
import { Request } from 'express';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UsersService,
  ) { }

  /**
   * Description: This method is used to create a new user in the application.
   * @description This method is used to create a new user in the application.
   * @param payload it is a request body contains payload of type AddUserPayload.
   * @param req this parameter contains the header of the request api.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addUser(@Body() payload: AddUserPayload, @Req() req: Request): Promise<any> {
    console.log('req === >', req.headers['origin']);
    type status_enum = '-1' | '0' | '1' | '99';
    const status: status_enum = "0";
    const pal = { ...payload, status: status };
    const user = await this.userService.addUser(pal, req);
    return user;
  }

  /**
   * Description: This method is used to upadte a user in the application.
   * @description This method is used to update a user in the application.
   * @param payload it is a request body contains payload of type UpdateUserPayload.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUser(@Body() payload: UpdateUserPayload): Promise<any> {
    const user = await this.userService.updateUser(payload);
    return user;
  }

  /**
   * Description: This method is used to soft delete a user in the application.
   * @description This method is used to soft delete a user in the application.
   * @param id it is a request parameter expect a number value of user id.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async softDeleteUser(@Param('id') id: number): Promise<any> {
    const user = await this.userService.softDeleteUser(id);
    return user;

  }

  /**
   * Description: This method is used to list the users by get method.
   * @description This method is used to list the users by get method.
   * @param payload it is a request query expects the payload of type ListUserPayload.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsers(@Query() params: ListUserPayload): Promise<any> {
    return this.userService.getUsers(params);
  }

  /**
   * Description: This method is used to get a user information.
   * @description This method is used to get a user information.
   * @param id it is a request parameter expect a number value of user id.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserById(@Param('id') id: number): Promise<any> {
    return this.userService.getUserById(id);
  }
}