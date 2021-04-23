import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ListUserPayload } from './list-user.payload';

import { User, UserFillableFields } from './user.entity';
import { UserToken } from './user-token.entity';
import { Mail } from '../../../utils/Mail';
import { EMAIL } from '../../../constants/email';

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
  
  async addUser(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    const newUser = await this.userRepository.create(payload);
    const savedUser = await this.userRepository.save(newUser);
    let token = this.jwtService.sign({ id: savedUser.id, time: new Date().getTime() });

    const tokenData = {user_id: savedUser.id, token: token};
    await this.userTokenRepository.save(this.userTokenRepository.create(tokenData));
    
    let tenant= {tenantEmail:"shivraj.singh@newvisionsoftware.in"};
    //this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, "Test")

    return savedUser;
  }
  
  async updateUser(payload) {
    const user = await this.get(payload.id);

    if (user) {
      user.site_id = payload.site_id;
      return await this.userRepository.save(user);
    } else{
      throw new NotAcceptableException(
        'User with provided id not available.',
      );
    }
  }

  async softDeleteUser(payload) {
    const user = await this.get(payload.id);

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
    if(payload.role || payload.role == 0){
      search = [{ role: payload.role },{status:'1'}]
    }
    if(payload.q && payload.q != ""){
      search = [{ name: Like("%"+payload.q+"%") },{status:'1'}]
    } 
    else{
      search = [{status:'1'}]
    }
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
    const tokenData = await this.userTokenRepository.findOne({where: [{token:token},{status:1}]});
    if(tokenData){
      console.log("tokenData",tokenData)
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
    const tokenData = await this.userTokenRepository.findOne({where: [{token:payload.token},{status:1}]});
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
}
