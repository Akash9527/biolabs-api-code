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

  async getBiolabsSource(payload:MasterPayload) {
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
    return await this.biolabsSourceRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }
  
  async createBiolabsSources() {
    const biolabsSources  = this.getFundings(new MasterPayload());
    let resp = {};
    return await biolabsSources.then(async data=> {
      const _biolabsSources = migrationData['biolabsSources'];
      for (const _biolabsSource of _biolabsSources) {
        if (!data.find(r=> r.name == _biolabsSource.name)) {
          resp[_biolabsSource.name] = await this.createBiolabsSource(_biolabsSource.name, _biolabsSource.id);
        }
        if (_biolabsSource.name == _biolabsSources[_biolabsSources.length - 1]) {
          return resp;
        }
      }
    }, error=>{
      console.log(error);
    });
  }

  async createBiolabsSource(name, id) {
    const status:status_enum = '1';
    const payload = {
      id, name, status
    }
    console.log("Adding biolabs sources: ", name);
    return await this.biolabsSourceRepository.save(this.biolabsSourceRepository.create(payload));
  }

  async getFundings(payload:MasterPayload) {
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
    return await this.fundingRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }
  
  async createFundings() {
    const fundings  = this.getFundings(new MasterPayload());
    let resp = {};
    return await fundings.then(async data=> {
      const _fundings = migrationData['fundings'];
      for (const _funding of _fundings) {
        if (!data.find(r=> r.name == _funding.name)) {
          resp[_funding.name] = await this.createFunding(_funding.name, _funding.id);
        }
        if (_funding.name == _fundings[_fundings.length - 1]) {
          return resp;
        }
      }
    }, error=>{
      console.log(error);
    });
  }

  async createFunding(name, id) {
    const status:status_enum = '1';
    const payload = {
      id, name, status
    }
    console.log("Adding funding: ", name);
    return await this.fundingRepository.save(this.fundingRepository.create(payload));
  }

  async getModalities(payload:MasterPayload) {
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
    return await this.modalityRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }
  
  async createModalities() {
    const modalities  = this.getModalities(new MasterPayload());
    let resp = {};
    return await modalities.then(async data=> {
      const _modalities = migrationData['modalities'];
      for (const _modalitie of _modalities) {
        if (!data.find(r=> r.name == _modalitie.name)) {
          resp[_modalitie.name] = await this.createModality(_modalitie.name, _modalitie.id);
        }
        if (_modalitie.name == _modalities[_modalities.length - 1]) {
          return resp;
        }
      }
    }, error=>{
      console.log(error);
    });
  }

  async createModality(name, id) {
    const status:status_enum = '1';
    const payload = {
      id, name, status
    }
    console.log("Adding modality: ", name);
    return await this.modalityRepository.save(this.modalityRepository.create(payload));
  }

  async getTechnologyStages(payload:MasterPayload) {
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
    return await this.technologyStageRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

}
