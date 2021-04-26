import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SITE_ADMIN_ACCESSLEVELS } from 'constants/privileges-site-admin';
import { SPONSOR_ACCESSLEVELS } from 'constants/privileges-sponsor';
import { SUPER_ADMIN_ACCESSLEVELS } from 'constants/privileges-super-admin';
import { Hash } from '../../../utils/Hash';
import { ConfigService } from '../../config';
import { User, UsersService } from '../user';
import { LoginPayload } from './login.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    //TODO: move the things to property file
    // used to create super admin
    const superAdmin = await this.userService.getByEmail('superadmin@biolabs.io');
    if (superAdmin) {
      console.info('superAdmin already exist.');
    } else {
      type status_enum = '-1' | '0' | '1' | '99';
      const status: status_enum = '1';
      let superAdminPayload = {
        'email': 'superadmin@biolabs.io',
        'role': 1,
        'site_id': [1, 2, 3, 4],
        'firstName': 'admin',
        'lastName': 'user',
        'title': 'Super',
        'phoneNumber': '',
        'password': 'biolabs',
        'status': status
      }
      await this.userService.create(superAdminPayload);
    }
  }

  async createToken(user: User) {
    let permissions = {};    
    switch(user.role){
      case 1:
        permissions=SUPER_ADMIN_ACCESSLEVELS;
        break;
      case 2:
        permissions=SITE_ADMIN_ACCESSLEVELS;
        break;
      case 3:
        permissions=SPONSOR_ACCESSLEVELS;
        break;
      default:
        break;
    }

    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id }),
      permissions:permissions,
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || user.status !='1' || user.password ==null || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }

  async validateToken(token){
    return this.userService.validateToken(token);
  }
  async forgotPassword(payload){
    return this.userService.forgotPassword(payload);
  }
}
