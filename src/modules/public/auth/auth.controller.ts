import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Put,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, LoginPayload, RegisterPayload } from '.';
import { UsersService } from '../user';
import { PasswordPayload } from './password.payload';
import { ForgotPasswordPayload } from './forgot-password.payload';
import { Request } from 'express';

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) { }

  /**
   * Description: This method is used to login a user.
   * @description This method is used to login a user.
   * @param payload it is a request body expects the payload of type LoginPayload.
   */
  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<any> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Description: This method is used to register a user.
   * @description This method is used to register a user.
   * @param payload it is a request body expects the payload of type RegisterPayload.
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    type status_enum = '-1' | '0' | '1' | '99';
    const status: status_enum = "1";
    const pal = { ...payload, status: status };
    const user = await this.userService.create(pal);
    return await this.authService.createToken(user);
  }

  /**
   * Description: This method is used to set new password for a user.
   * @description This method is used to set new password for a user.
   * @param payload it is a request body expects the payload of type PasswordPayload.
   */
  @Put('set-password')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async setNewPassword(@Body() payload: PasswordPayload): Promise<any> {
    return await this.userService.setNewPassword(payload);
  }

  /**
   * Description: This method is used to validate a token for a user.
   * @description This method is used to validate a token for a user.
   * @param payload it is a request param expects the payload of type string.
   */
  @Get('verify-link/:token')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifyLink(@Param('token') token: string): Promise<any> {
    return await this.authService.validateToken(token);
  }

  /**
   * Description: This method is used to get a password reset link for a user.
   * @description This method is used to get a password reset link for a user.
   * @param payload it is a request body expects the payload of type ForgotPasswordPayload.
   */
  @Post('forgot-password')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async forgotPassword(@Body() payload: ForgotPasswordPayload, @Req() req: Request): Promise<any> {
    return await this.authService.forgotPassword(payload, req);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // @Get('me')
  // @ApiResponse({ status: 200, description: 'Successful Response' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getLoggedInUser(@Request() request): Promise<any> {
  //   return request.user;
  // }


}
