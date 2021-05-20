import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ListUserPayload } from './list-user.payload';

import { User, UserFillableFields } from './user.entity';
import { UserToken } from './user-token.entity';
import { Mail } from '../../../utils/Mail';
import { EMAIL } from '../../../constants/email';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mail: Mail,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) { }

  /**
   * Description: This method is used to get the user information by id.
   * @description This method is used to get the user information by id.
   * @param id number user id
   * @return user object
   */
  async get(id: number) {
    return this.userRepository.findOne(id);
  }

  /**
   * Description: This method is used to get the user information by email.
   * @description This method is used to get the user information by email.
   * @param email string user email
   * @return user object
   */
  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  /**
   * Description: This method is used to create the new user.
   * @description This method is used to create the new user.
   * @param payload object of type UserFillableFields
   * @return user object
   */
  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return await this.userRepository.save(this.userRepository.create(payload));
  }

  /**
   * Description: This method is used to create the new user.
   * @description This method is used to create the new user.
   * @param payload object of type UserFillableFields
   * @param req object of type Request
   * @return user object
   */
  async addUser(payload: UserFillableFields, req: Request) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    const newUser = await this.userRepository.create(payload);
    const savedUser = await this.userRepository.save(newUser);
    const userInformation = await this.generateToken(savedUser);
    const userInfo = {
      token: userInformation.token,
      userName: savedUser.firstName,
      origin: req.headers['origin']
    }
    let tenant = { tenantEmail: payload.email };
    console.log('tenant in user service', tenant);
    this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, "Invite", userInfo);

    return savedUser;
  }

  /**
   * Description: This method is used to update the user.
   * @description This method is used to update the user.
   * @param payload object of user information
   * @return user object
   */
  async updateUser(payload) {
    const user = await this.get(payload.id);
    if (user) {
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.title = payload.title;
      user.phoneNumber = payload.phoneNumber;
      user.companyId = payload.companyId;
      if (payload.password && (payload.password !== "" && payload.password != null)) {
        user.password = payload.password;
      } else {
        delete user.password;
      }
      await this.userRepository.update(user.id, user);
      if (user.password)
        delete user.password;
      return user;
    } else {
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  /**
   * Description: This method is used to update the user profile pic.
   * @description This method is used to update the user profile pic.
   * @param payload object of user information with imageUrl
   * @return user object
   */
   async updateUserProfilePic(payload) {
    const user = await this.get(payload.id);
    if (user) {
      delete user.password;
      user.imageUrl = payload.imageUrl;
      await this.userRepository.update(user.id, user);
      return user;
    } else {
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  /**
   * Description: This method is used to soft delete the user.
   * @description This method is used to soft delete the user.
   * @param id number of user id
   * @return object of affected rows
   */
  async softDeleteUser(id) {
    const user = await this.get(id);

    if (user) {
      user.status = "99";
      return await this.userRepository.save(user);
    } else {
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  /**
   * Description: This method is used to list the user.
   * @description This method is used to list the user.
   * @param payload object of type ListUserPayload
   * @return array of user object
   */
  async getUsers(payload: ListUserPayload) {
    let search;
    let skip;
    let take;
    let _search = {};
    if (payload.role || payload.role == 0) {
      _search = { ..._search, ...{ role: payload.role } };
    }
    if (payload.q && payload.q != "") {
      _search = { ..._search, ...{ name: Like("%" + payload.q + "%") } };
    }
    search = [{ ..._search, status: '1' }, { ..._search, status: '0' }]
    if (payload.pagination) {
      skip = { skip: 0 }
      take = { take: 10 }
      if (payload.limit) {
        take = { take: payload.limit };
        if (payload.page) {
          skip = { skip: payload.page * payload.limit }
        }
      }
    }
    return await this.userRepository.find({
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method is used to get the user by id.
   * @description This method is used to get the user by id.
   * @param id number of user id
   * @return user object
   */
  async getUserById(id) {
    const user = await this.get(id);
    if (user) {
      return user;
    } else {
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  /**
   * Description: This method is used to validate the user token.
   * @description This method is used to validate the user token.
   * @param token string
   * @return user object
   */
  async validateToken(token: string) {
    const tokenData = await this.userTokenRepository.findOne({ where: [{ token: token, status: 1 }] });
    if (tokenData) {
      //console.log("tokenData",tokenData)
      const user = await this.get(tokenData.user_id);
      if (user.status == "1" || user.status == "0")
        return user;
      else {
        throw new NotAcceptableException(
          'Token is invalid.',
        );
      }
    } else {
      throw new NotAcceptableException(
        'Token is invalid.',
      );
    }
  }

  /**
   * Description: This method is used to set new password for the user.
   * @description This method is used to set new password for the user.
   * @param payload object of user info asnd new passsword
   * @return user object
   */
  async setNewPassword(payload) {
    const tokenData = await this.userTokenRepository.findOne({ where: [{ token: payload.token, status: 1 }] });
    if (tokenData) {
      const user = await this.get(tokenData.user_id);
      if (user.status == "1" || user.status == "0") {
        user.password = payload.password;
        user.status = "1";
        const newUser = await this.userRepository.save(user);
        tokenData.status = "99";
        this.userTokenRepository.save(tokenData);
        return newUser;
      }
      else {
        throw new NotAcceptableException(
          'Token is invalid.',
        );
      }
    } else {
      throw new NotAcceptableException(
        'Token is invalid.',
      );
    }
  }

  /**
   * Description: This method is used to generate the token for the user.
   * @description This method is used to generate the token for the user.
   * @param user object of user info asnd new passsword
   * @return user object
   */
  async generateToken(user) {
    let token = this.jwtService.sign({ id: user.id, time: new Date().getTime() });
    console.log("token==>", token);
    const tokenData = { user_id: user.id, token: token };
    const tokenChk = await this.userTokenRepository.find({ where: [{ user_id: user.id, status: "1" }] });
    if (tokenChk) {
      await this.userTokenRepository.update({ user_id: user.id }, { status: "99" });
    }
    return await this.userTokenRepository.save(this.userTokenRepository.create(tokenData));
  }

  /**
   * Description: This method is used to generate the token for the user to reset the password.
   * @description This method is used to generate the token for the user to reset the password.
   * @param payload object of user info for reset passsword
   * @param req object of Request
   * @return user object
   */
  async forgotPassword(payload: UserFillableFields, req: Request) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      const userInformation = await this.generateToken(user);
      const userInfo = {
        token: userInformation.token,
        userName: user.firstName,
        origin: req.headers['origin']
      }
      let tenant = { tenantEmail: payload.email, role: payload.role };
      this.mail.sendEmail(tenant, EMAIL.SUBJECT_FORGOT_PASSWORD, "forgotMail", userInfo)
      return true;
    } else {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
  }
}
