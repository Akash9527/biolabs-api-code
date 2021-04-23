import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MasterPayload } from './master.payload';
import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(BiolabsSource)
    private readonly biolabsSourceRepository: Repository<BiolabsSource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    @InjectRepository(Modality)
    private readonly modalityRepository: Repository<Modality>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(TechnologyStage)
    private readonly technologyStageRepository: Repository<TechnologyStage>,
  ) {}

  async getSites(payload:MasterPayload) {
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
    console.info("where",search, skip,take, payload);
    return await this.siteRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  async getRoles(payload:MasterPayload) {
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
    return await this.roleRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }
  
  async getCategories(payload:MasterPayload) {
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
    return await this.categoryRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }
}
