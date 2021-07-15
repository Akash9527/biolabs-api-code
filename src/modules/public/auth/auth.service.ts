import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SITE_ADMIN_ACCESSLEVELS } from '../../../constants/privileges-site-admin';
import { SPONSOR_ACCESSLEVELS } from '../../../constants/privileges-sponsor';
import { SUPER_ADMIN_ACCESSLEVELS } from '../../../constants/privileges-super-admin';
import { Hash } from '../../../utils/Hash';
import { ConfigService } from '../../config';
import { User, UsersService } from '../user';
import { LoginPayload } from './login.payload';
import { MasterService } from '../master';
import { RESIDENT_ACCESSLEVELS } from '../../../constants/privileges-resident';
import { ResidentCompanyService } from '../resident-company/resident-company.service';


const appRoot = require('app-root-path');
const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/migration.json"));

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly masterService: MasterService,
    private readonly residentCompanyService: ResidentCompanyService
  ) { }

  /**
   * Description: This method will call on appliaction boot up to generate the master data.
   * @description This method will call on appliaction boot up to generate the master data.
   */
  async onApplicationBootstrap() {
    await this.masterService.createRoles();
    await this.masterService.createSites();
    await this.masterService.createFundings();
    await this.masterService.createModalities();
    await this.masterService.createBiolabsSources();
    await this.masterService.createCategories();
    await this.masterService.createTechnologyStages();
    await this.masterService.createCategories();
    await this.createSuperAdmin();
  }

  /**
   * Description: This method creates the default super admin with all site access.
   * @description This method creates the default super admin with all site access.
   * @return user object with token info
   */
  public async createSuperAdmin() {
    const superAdmin = await this.userService.getByEmail('superadmin@biolabs.io');
    if (!superAdmin) {
      await this.userService.create(migrationData['superadmin']);
    }
  }

  /**
   * Description: This method is used to generate the token for the logged in user.
   * @description This method is used to generate the token for the logged in user.
   * @param user object of User
   * @return user object with token info
   */
  createToken(user: User) {
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
      case 4:
        permissions = RESIDENT_ACCESSLEVELS;
        break;
      default:
        break;
    }

    return {
      expiresIn: process.env.APPSETTING_JWT_EXPIRATION_TIME,
      accessToken: this.jwtService.sign({ id: user.id }),
      permissions: permissions,
      user,
    };
  }

  /**
   * Description: This method is used to validate the user.
   * @description This method is used to validate the user.
   * @param payload object of LoginPayload
   * @return user object
   */
  async validateUser(payload: LoginPayload): Promise<any> {
    const user: any = await this.userService.getByEmail(payload.email);
    if (!user || user.status != '1' || user.password == null || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    if (user.companyId) {
      const company = await this.residentCompanyService.getResidentCompany(user.companyId);
      if (company)
        user.company = company;
    }
    return user;
  }

  /**
   * Description: This method is used to validate the user token.
   * @description This method is used to validate the user token.
   * @param token string
   * @return user object
   */
  async validateToken(token) {
    return this.userService.validateToken(token);
  }

  /**
   * Description: This method is used to generate the token for the user to reset the password.
   * @description This method is used to generate the token for the user to reset the password.
   * @param payload object of user info for reset passsword
   * @param req object of Request
   * @return user object
   */
  async forgotPassword(payload, req) {
    return this.userService.forgotPassword(payload, req);
  }
}