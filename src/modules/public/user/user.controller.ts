import {
    Controller,
    UseGuards,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '.';
import { MasterPayload } from '../master/master.payload';
import { AddUserPayload } from './add-user.payload';
import { UpdateUserPayload } from './update-user.payload';
import { DeleteUserPayload } from './delete-user.payload';
import { ListUserPayload } from './list-user.payload';
  
  @Controller('api/user')
  @ApiTags('User')
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
      type status_enum = '-1' | '0' | '1' | '99'; 
      const status:status_enum = "0";
      const pal = {...payload, status:status};
        const user = await this.userService.addUser(pal);
        return user;
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Patch()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateUser(@Body() payload:UpdateUserPayload): Promise<any> {
        const user = await this.userService.updateUser(payload);
        return user;
    }

    
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Delete()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async softDeleteUser(@Body() payload:DeleteUserPayload): Promise<any> {
        const user = await this.userService.softDeleteUser(payload);
        return user;

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get()
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getSites(@Param() params:ListUserPayload): Promise<any> {
      return this.userService.getUsers(params);
    }
    
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getUserById(@Param('id') id:number): Promise<any> {
      return this.userService.getUserById(id);
    }
  }
  