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
const appRoot = require('app-root-path');
const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/migration.json"));
type status_enum = '-1' | '0' | '1' | '99';


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
      search = [{ name: Like("%"+payload.q+"%"), status:'1'}]
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

  async createSites() {
    const sites  = this.getSites(new MasterPayload());
    let resp = {};
    return await sites.then(async data=> {
      const _sites = migrationData['sites'];
      for (const _site of _sites) {
        if (!data.find(r=> r.name == _site.name)) {
          resp[_site.name] = await this.createSite(_site.name, _site.id);
        }
        if (_site.name == _site[_site.length - 1]) {
          return resp;
        }
      }
    }, error=>{
      console.log(error);
    })
  }

  async createSite(name, id) {
    const status:status_enum = '1';
    const payload = {
      id, name, status
    }
    console.log("Adding Site: ", name);
    return await this.siteRepository.save(this.siteRepository.create(payload));
  }


  async getRoles(payload:MasterPayload) {
    let search;
    let skip;
    let take;
    if(payload.q && payload.q != ""){
      search = [{ name: Like("%"+payload.q+"%"), status:'1'}]
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

  async createRoles() {
    const roles  = this.getRoles(new MasterPayload());
    let resp = {};
    return await roles.then(async data=> {
      const _roles = migrationData['roles'];
      for (const _role of _roles) {
        if (!data.find(r=> r.name == _role.name)) {
          resp[_role.name] = await this.createRole(_role.name, _role.id);
        }
        if (_role.name == _roles[_roles.length - 1]) {
          return resp;
        }
      }
    }, error=>{
      console.log(error);
    });
  }

  async createRole(name, id) {
    const status:status_enum = '1';
    const payload = {
      id, name, status
    }
    console.log("Adding Role: ", name);
    return await this.roleRepository.save(this.roleRepository.create(payload));
  }
  
  async getCategories(payload:MasterPayload) {
    let search;
    let skip;
    let take;
    if(payload.q && payload.q != ""){
      search = [{ name: Like("%"+payload.q+"%"), status:'1'}]
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
