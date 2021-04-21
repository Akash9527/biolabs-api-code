import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../../utils/Hash';
import { ConfigService } from '../../config';
import { User, UsersService } from '../user';
import { LoginPayload } from './login.payload';
import { Mail } from '../../../utils/Mail';
import { EMAIL } from '../../../constants/email';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mail: Mail,
  ) {}

  async createToken(user: User) {
    let tenant: {tenantEmail:"shivraj.singh@newvisionsoftware.in"};
    this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, "Test")
    return {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id }),
      user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    return user;
  }
}
