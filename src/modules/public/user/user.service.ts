import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListUserPayload } from './list-user.payload';

import { User, UserFillableFields } from './user.entity';
import { UserToken } from './user-token.entity';
import { Mail } from '../../../utils/Mail';
import { EMAIL } from '../../../constants/email';
import { Request } from 'express';
import { ResidentCompanyService } from '../resident-company/resident-company.service';
const { info, error, debug } = require('../../../utils/logger');
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly residentCompanyService: ResidentCompanyService,
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
    info("Getting user information by user ID :" + id, __filename, "get()");
    return this.userRepository.findOne(id);
  }

  /**
   * Description: This method is used to get the user information by email.
   * @description This method is used to get the user information by email.
   * @param email string user email
   * @return user object
   */
  async getByEmail(email: string) {
    info("Getting user information by user email ID :" + email, __filename, "getByEmail()");
    try {
      return await this.userRepository
        .createQueryBuilder('users')
        .addSelect("users.email")
        .addSelect("users.password")
        .where('users.email = :email')
        .setParameter('email', email)
        .getOne();
    } catch (er) {
      error("Getting error in find user by email id " + email, __filename, "getByEmail()");
      throw new BiolabsException(er);
    }
  }

  /**
   * Description: This method is used to create the new user.
   * @description This method is used to create the new user.
   * @param payload object of type UserFillableFields
   * @return user object
   */
  async create(payload: UserFillableFields) {
    info("Creating a new biolabs user", __filename, "create()");
    const user = await this.getByEmail(payload.email);

    if (user) {
      if (user.email == 'superadmin@biolabs.io') {
        // Appending userId to superadmin payload
        payload = { ...payload, ...{ id: user.id } };
        return await this.userRepository.save(this.userRepository.create(payload));
      } else {
        debug("User with provided email already created", __filename, "create()");
        throw new NotAcceptableException('User with provided email already created.',
        );
      }
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
    debug("Adding a new biolabs user" + payload.email, __filename, "addUser()");
    let savedUser: any = null;
    try {
      const user = await this.getByEmail(payload.email);
      if (user) {
        debug("User with provided email already created", __filename, "addUser()");
        throw new NotAcceptableException('User with provided email already created.');
      }
      const newUser = await this.userRepository.create(payload);
      savedUser = await this.userRepository.save(newUser);
      const userInformation = await this.generateToken(savedUser);
      const userInfo = {
        token: userInformation.token,
        userName: savedUser.firstName,
        origin: req.headers['origin'],
        userRole: payload.role
      };
      let tenant = { tenantEmail: payload.email };
      this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, 'Invite', userInfo);
      info("User added successfully", __filename, "addUser(");
    } catch (err) {
      error("Getting error to create the new user " + err.message, __filename, "addUser()");
      throw new InternalException('Getting error to create the new user', err.message);

    }
    return savedUser;
  }

  /**
   * Description: This method is used to update the user.
   * @description This method is used to update the user.
   * @param payload object of user information
   * @return user object
   */
  async updateUser(payload) {
    debug("Updating user " + payload.email, __filename, "updateUser()");
    const user = await this.get(payload.id);
    try {
      if (user) {
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.title = payload.title;
        user.phoneNumber = payload.phoneNumber;
        user.companyId = (payload.companyId) ? payload.companyId : user.companyId;
        user.userType = payload.userType;
        user.site_id = (payload.site_id) ? payload.site_id : user.site_id;
        if (
          payload.password &&
          payload.password !== '' &&
          payload.password != null
        ) {
          user.password = payload.password;
        } else {
          delete user.password;
        }
        if(payload.hasOwnProperty('isRequestedMails')){
          user.isRequestedMails = payload.isRequestedMails;
        }
        if(payload.mailsRequestType){
          user.mailsRequestType = payload.mailsRequestType;
        }
        await this.userRepository.update(user.id, user);
        info("User updated successfully", __filename, "updateUser(");
        if (user.password) delete user.password;
        return await this.getUserById(user.id);
      } else {
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Getting error to create the new user " + err.message, __filename, "updateUser()");
      throw new BiolabsException('Getting error in updating user', err.message);
    }
  }

  /**
   * Description: This method is used to update the user profile pic.
   * @description This method is used to update the user profile pic.
   * @param payload object of user information with imageUrl
   * @return user object
   */
  async updateUserProfilePic(payload) {
    info("Updating the user profile picture " + payload.email);
    const user = await this.get(payload.id);
    try {
      if (user) {
        delete user.password;
        user.imageUrl = payload.imageUrl;
        await this.userRepository.update(user.id, user);
        return user;
      } else {
        error("User with provided id not available." + payload.id, __filename, "updateUserProfilePic()");
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Getting error in updating the user profile picture" + err.message, __filename, "updateUserProfilePic()");
      throw new BiolabsException('Getting error in updating the user profile picture', err.message);

    }
  }

  /**
   * Description: This method is used to soft delete the user.
   * @description This method is used to soft delete the user.
   * @param id number of user id
   * @return object of affected rows
   */
  async softDeleteUser(id) {
    info("Inside soft delete the user userId " + id, __filename, "softDeleteUser()");
    const FOR_DELETE_USER = "Deleted";
    const FOR_USER = "User";
    try {
      const user = await this.get(id);
      if (user) {
        user.status = '99';
        user.email = FOR_DELETE_USER;
        user.firstName = FOR_USER;
        user.lastName = FOR_DELETE_USER;
        user.password = FOR_DELETE_USER;
        user.phoneNumber = FOR_DELETE_USER;
        user.imageUrl = FOR_DELETE_USER;
        user.title = FOR_DELETE_USER;
        debug("Before Saving", __filename, "softDeleteUser()");
        return await this.userRepository.save(user);
      } else {
        error("User with provided id not available." + id, __filename, "softDeleteUser()");
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Error in soft delete user", __filename, "softDeleteUser()");
      throw new BiolabsException('Error in soft delete user', err);
    }
  }

  /**
   * Description: This method is used to list the user.
   * @description This method is used to list the user.
   * @param payload object of type ListUserPayload
   * @return array of user object
   */
  async getUsers(payload: ListUserPayload, siteIdArr?: number[]) {
    info("Getting list of user", __filename, "getUsers()");
    let userQuery = await this.userRepository.createQueryBuilder("users")
      .where("users.status IN (:...status)", { status: [1, 0] })
      .andWhere("users.site_id && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
    if (payload.role || payload.role == 0) {
      userQuery.andWhere("users.role = :role", { role: payload.role });
    }
    if (payload.q && payload.q != '') {
      userQuery.andWhere("(users.firstName LIKE :name OR users.lastName LIKE :name) ", { name: `%${payload.q}%` });
    }

    if (payload.pagination) {
      let skip = 0;
      let take = 10;
      if (payload.limit) {
        take = payload.limit;
        if (payload.page) {
          skip = payload.page * payload.limit;
        }
      }
      userQuery.skip(skip).take(take)
    }
    userQuery.addOrderBy("users.firstName", "ASC");
    userQuery.addOrderBy("users.lastName", "ASC");
    debug("Getting list of user by query : ", __filename, "getUsers()");
    return await userQuery.getMany();
    // return await this.userRepository.find({
    //   where: search,
    //   skip,
    //   take,
    // });

  }

  /**
   * Description: This method is used to get the user by id.
   * @description This method is used to get the user by id.
   * @param id number of user id
   * @return user object
   */
  async getUserById(id) {
    info("Getting user by Id : " + id, __filename, "getUserById()");
    const user: any = await this.get(id);
    if (user) {
      if (user.companyId) {
        const company = await this.residentCompanyService.getResidentCompany(
          user.companyId, null
        );
        if (company) user.company = company;
      }
      return user;
    } else {
      error("User with provided id not available.", __filename, "getUserById()");
      throw new NotAcceptableException('User with provided id not available.');
    }
  }

  /**
   * Description: This method is used to validate the user token.
   * @description This method is used to validate the user token.
   * @param token string
   * @return user object
   */
  async validateToken(token: string) {
    info("Validating user token : " + token, __filename, "validateToken()");
    try {
      const tokenData = await this.userTokenRepository.findOne({
        where: [{ token: token, status: 1 }],
      });
      if (tokenData) {
        const user = await this.get(tokenData.user_id);
        if (user.status == '1' || user.status == '0') return user;
        else {
          error("Token is invalid", __filename, "setNewPassword()");
          throw new NotAcceptableException('Token is invalid.');
        }
      } else {
        error("Token is invalid", __filename, "setNewPassword()");
        throw new NotAcceptableException('Token is invalid.');
      }
    } catch (err) {
      error("Getting error in validating the user token", __filename, "validateToken()");
      throw new BiolabsException('Getting error in validating the user token' + err.message);
    }
  }

  /**
   * Description: This method is used to set new password for the user.
   * @description This method is used to set new password for the user.
   * @param payload object of user info asnd new passsword
   * @return user object
   */
  async setNewPassword(payload) {
    info("Setting the user's new password. email : " + payload.email);
    const tokenData = await this.userTokenRepository.findOne({
      where: [{ token: payload.token, status: 1 }],
    });
    if (tokenData) {
      const user = await this.get(tokenData.user_id);
      if (user.status == '1' || user.status == '0') {
        user.password = payload.password;
        user.status = '1';
        const newUser = await this.userRepository.save(user);
        tokenData.status = '99';
        this.userTokenRepository.save(tokenData);
        return newUser;
      } else {
        error("Token is invalid", __filename, "setNewPassword()");
        throw new NotAcceptableException('Token is invalid.');
      }
    } else {
      error("Token is invalid", __filename, "setNewPassword()");
      throw new NotAcceptableException('Token is invalid.');
    }
  }

  /**
   * Description: This method is used to generate the token for the user.
   * @description This method is used to generate the token for the user.
   * @param user object of user info asnd new passsword
   * @return user object
   */
  async generateToken(user) {
    info("Generate the token for the user" + user.email, __filename, "generateToken()");
    try {
      let token = this.jwtService.sign({
        id: user.id,
        time: new Date().getTime(),
      });
      const tokenData = { user_id: user.id, token: token };
      const tokenChk = await this.userTokenRepository.find({
        where: [{ user_id: user.id, status: '1' }],
      });
      if (tokenChk) {
        await this.userTokenRepository.update(
          { user_id: user.id },
          { status: '99' },
        );
      }
      return await this.userTokenRepository.save(
        this.userTokenRepository.create(tokenData),
      );
    } catch (err) {
      error("Getting error in generating user token", __filename, "generateToken()");
      throw new BiolabsException('Getting error in generating user token', err.message);
    }

  }

  /**
   * Description: This method is used to generate the token for the user to reset the password.
   * @description This method is used to generate the token for the user to reset the password.
   * @param payload object of user info for reset passsword
   * @param req object of Request
   * @return user object
   */
  async forgotPassword(payload: UserFillableFields, req: Request) {
    info("Generate the token for the user to reset the password" + payload.email, __filename, "forgotPassword()");
    try {
      const user = await this.getByEmail(payload.email);
      if (user) {
        const userInformation = await this.generateToken(user);
        const userInfo = {
          token: userInformation.token,
          userName: user.firstName,
          origin: req.headers['origin'],
        };
        let tenant = { tenantEmail: payload.email, role: payload.role };
        this.mail.sendEmail(
          tenant,
          EMAIL.SUBJECT_FORGOT_PASSWORD,
          'forgotMail',
          userInfo,
        );
        return true;
      } else {
        throw new NotAcceptableException(
          'User with provided email already created.',
        );
      }
    } catch (err) {
      error("Getting error in forget password process or sending email", __filename, "forgotPassword()");
      throw new BiolabsException('Getting error in forget password process', err.message);
    }
  }
  
}