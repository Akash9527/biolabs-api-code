import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MasterPayload } from '../master/master.payload';

import { User, UserFillableFields } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    return await this.userRepository.save(this.userRepository.create(payload));
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

  async getUsers(payload:MasterPayload) {
    let search;
    let skip;
    let take;
    if(payload.q && payload.q != ""){
      search = [{ name: Like("%"+payload.q+"%") },{status:'1'}]
    } else{
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
}
