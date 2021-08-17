import { Controller, Body, Post, Get, Put, Param, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, LoginPayload } from '.';
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
}