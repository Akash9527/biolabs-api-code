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
  ) {}

  async get(id: number) {
    return this.userRepository.findOne(id);
  }

  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return await this.userRepository.save(this.userRepository.create(payload));
  }
  
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
      token:userInformation.token,
      userName:savedUser.firstName,
      origin: req.headers['origin']
    }
    let tenant = { tenantEmail: payload.email };
    console.log('tenant in user service', tenant);
    this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, "Invite", userInfo);

    return savedUser;
  }
  
  async updateUser(payload) {
    const user = await this.get(payload.id);
    if (user) {
      user.site_id = payload.site_id;
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.title = payload.title;
      user.phoneNumber = payload.phoneNumber;
      if(payload.password && (payload.password !=="" && payload.password != null)){
        user.password = payload.password;
      }else{
        delete user.password;
      }
      await this.userRepository.update(user.id, user);
      if(user.password)
        delete user.password;
      return user;
    } else{
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  async softDeleteUser(id) {
    const user = await this.get(id);

    if (user) {
      user.status = "99";
      return await this.userRepository.save(user);
    } else{
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  async getUsers(payload:ListUserPayload) {
    let search;
    let skip;
    let take;
    let _search = {};
    if(payload.role || payload.role == 0) {
      _search = {..._search, ...{role: payload.role}};
    }
    if(payload.q && payload.q != ""){
      _search = {..._search, ...{name: Like("%"+payload.q+"%")}};
    } 
    search = [{..._search, status:'1'},{..._search, status:'0'}]
    if(payload.pagination){
      skip = { skip: 0 }
      take = { take: 10 }
      if(payload.limit){
        take = { take: payload.limit };
        if(payload.page){
          skip = { skip: payload.page*payload.limit }
        }
      }
    }
    return await this.userRepository.find({
      where: search,
      skip,
      take
    });
  }

  async getUserById(id){
    const user = await this.get(id);
    if(user){
      return user;
    } else{
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  async validateToken(token:string){
    const tokenData = await this.userTokenRepository.findOne({where: [{token:token, status:1}]});
    if(tokenData){
      //console.log("tokenData",tokenData)
      const user = await this.get(tokenData.user_id);
      if(user.status=="1" || user.status=="0")
        return user;
      else{
        throw new NotAcceptableException(
          'Token is invalid.',
        );
      }
    } else{
      throw new NotAcceptableException(
        'Token is invalid.',
      );
    }
  }

  async setNewPassword(payload){
    const tokenData = await this.userTokenRepository.findOne({where: [{token:payload.token, status:1}]});
    if(tokenData){
      console.log("tokenData",tokenData)
      const user = await this.get(tokenData.user_id);
      if(user.status=="1" || user.status=="0"){
        user.password = payload.password;
        user.status = "1";
        const newUser = await this.userRepository.save(user);
        tokenData.status = "99";
        this.userTokenRepository.save(tokenData);
        return newUser;
      }
      else{
        throw new NotAcceptableException(
          'Token is invalid.',
        );
      }
    } else{
      throw new NotAcceptableException(
        'Token is invalid.',
      );
    }
  }
  
  async generateToken(user){
    let token = this.jwtService.sign({ id: user.id, time: new Date().getTime() });
    console.log("token==>",token);
    const tokenData = {user_id: user.id, token: token};
    const tokenChk = await this.userTokenRepository.find({where: [{user_id:user.id, status:"1"}]});
    if(tokenChk){
      await this.userTokenRepository.update({user_id:user.id},{status:"99"});
    }
    return await this.userTokenRepository.save(this.userTokenRepository.create(tokenData));
  }

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
