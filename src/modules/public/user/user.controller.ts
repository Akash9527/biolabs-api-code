import {
    Controller,
    UseGuards,
    Get,
    Request,
    Param,
    Post,
    Body,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '.';
import { MasterPayload } from '../master/master.payload';
import { AddUserPayload } from './add-user.payload';
  
  
  @Controller('api/user')
  @ApiTags('user')
  export class UserController {
    constructor(
        private readonly userService: UsersService,
    ) {}
  
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addUser(@Body() payload:AddUserPayload): Promise<any> {
        const user = await this.userService.addUser(payload);
        // return this.userService.addUser(payload);

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('users')
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getSites(@Param() params:MasterPayload): Promise<any> {
      return this.userService.getUsers(params);
    }
    
  }
  