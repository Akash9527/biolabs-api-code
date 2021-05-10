import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SITE_ADMIN_ACCESSLEVELS } from 'constants/privileges-site-admin';
import { SPONSOR_ACCESSLEVELS } from 'constants/privileges-sponsor';
import { SUPER_ADMIN_ACCESSLEVELS } from 'constants/privileges-super-admin';
import { Hash } from '../../../utils/Hash';
import { ConfigService } from '../../config';
import { User, UsersService } from '../user';
import { LoginPayload } from './login.payload';
import { MasterService } from '../master';

const appRoot = require('app-root-path');
const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/migration.json"));

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly masterService: MasterService
  ) { }

  async onApplicationBootstrap() {
    await this.masterService.createRoles();
    await this.masterService.createSites();
    await this.masterService.createFundings();
    await this.masterService.createModalities();
    await this.masterService.createBiolabsSources();
    await this.createSuperAdmin();
  }

  /**
   * @description: Creates the default super admin with all site access
   */
  private async createSuperAdmin() {
    const superAdmin = await this.userService.getByEmail('superadmin@biolabs.io');
    if (!superAdmin) {
      console.log("Creating Super Admin");
      await this.userService.create(migrationData['superadmin']);
    }
  }

  async createToken(user: User) {
    let permissions = {};
    switch (user.role) {
      case 1:
        permissions = SUPER_ADMIN_ACCESSLEVELS;
        break;
      case 2:
        permissions = SITE_ADMIN_ACCESSLEVELS;
        break;
      case 3:
        permissions = SPONSOR_ACCESSLEVELS;
        break;
      default:
        break;
    }

    return {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      accessToken: this.jwtService.sign({ id: user.id }),
      permissions: permissions,
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || user.status != '1' || user.password == null || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }

  async validateToken(token) {
    return this.userService.validateToken(token);
  }
  async forgotPassword(payload, req) {
    return this.userService.forgotPassword(payload, req);
  }
}
