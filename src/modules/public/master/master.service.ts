import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { MasterPayload } from './master.payload';
import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';
import { COMPANY_STATUS } from '../../../constants/company-status';
import { USER_TYPE } from '../../../constants/user-type';
import { COMMITTEE_STATUS } from 'constants/committee_status';
import { ProductType } from '../order/model/product-type.entity';

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
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) { }

  /**
   * Description: This method will return the sites list.
   * @description This method will return the sites list.
   * @param payload MasterPayload[]
   * @return array of sites object
   */
  async getSites(payload: MasterPayload) {
    let search: any = {};
    let skip;
    let take;
    // filtering site list. Use payload.role if role is required.
    if (payload.siteIdArr) {
      payload.siteIdArr = this.parseToArray(payload.siteIdArr);
      search = { id: In(payload.siteIdArr) };
    }

    if (payload.q && payload.q != "") {
      search = { ...search, ...{ name: Like("%" + payload.q + "%"), status: '1' } };
    } else {
      search = { ...search, ...{ status: '1' } };
    }

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

    return await this.siteRepository.find({
      select: ["id", "name", "longName", "standardizedAddress"],
      where: search,
      order: { ['name']: 'ASC' },
      skip,
      take
    });
  }

  /**
   * Description: This method will store the Product information.
   * @description This method will store the Product information.
   * @return array of product object 
   */
  async createProductType() {
    const productType = await this.productTypeRepository.find();
    const ptypeData = migrationData["productTypeName"]
    if (!productType || productType.length == 0) {
      for (let index = 0; index < ptypeData.length; index++) {
        const productType = ptypeData[index];
        await this.productTypeRepository.save(this.productTypeRepository.create(productType));
      }
    }
  }

  /**
   * Description: This method will store the sites.
   * @description This method will store the sites.
   * @return array of site object
   */
  async createSites() {
    const sites = this.getSites(new MasterPayload());
    // await this.siteRepository.delete({}); //delete all the entries first
    let resp = {};
    return await sites.then(async data => {
      const _sites = migrationData['sites'];
      for (const _site of _sites) {
        if (!data.find(r => r.name == _site.name)) {
          resp[_site.name] = await this.createSite(_site.name, _site.id, _site.longName, _site.standardizedAddress);
        }
        if (_site.name == _site[_site.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    })
  }

  /**
   * Description: This method will store the site.
   * @description This method will store the site.
   * @param name string
   * @param id number
   * @return site object
   */
  async createSite(name: string, id: number, longName: string, standardizedAddress: string) {
    const status: status_enum = '1';
    const payload = {
      id, name, status, longName, standardizedAddress
    }
    return await this.siteRepository.save(this.siteRepository.create(payload));
  }

  /**
   * Description: This method will return the roles list.
   * @description This method will return the roles list.
   * @param payload MasterPayload[]
   * @return array of roles object
   */
  async getRoles(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    return await this.roleRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will store the roles.
   * @description This method will store the roles.
   * @return array of role object
   */
  async createRoles() {
    const roles = this.getRoles(new MasterPayload());
    let resp = {};
    return await roles.then(async data => {
      const _roles = migrationData['roles'];
      for (const _role of _roles) {
        if (!data.find(r => r.name == _role.name)) {
          resp[_role.name] = await this.createRole(_role.name, _role.id);
        }
        if (_role.name == _roles[_roles.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    });
  }

  /**
   * Description: This method will store the role.
   * @description This method will store the role.
   * @param name string
   * @param id number
   * @return role object
   */
  async createRole(name: string, id: number) {
    const status: status_enum = '1';
    const payload = {
      id, name, status
    }
    return await this.roleRepository.save(this.roleRepository.create(payload));
  }

  /**
   * Description: This method will return the categories list.
   * @description This method will return the categories list.
   * @param payload MasterPayload[]
   * @return array of categories object
   */
  async getCategories(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    const categories: any[] = await this.categoryRepository.find({
      select: ["id", "name", "parent_id"],
      where: search,
      order: { id: "ASC" },
      skip,
      take
    });
    // Create root for top-level node(s)
    const root: any[] = [];

    categories.forEach(category => {
      // No parentId means top level
      if (!category.parent_id) return root.push(category);

      // Insert node as child of parent in flat array
      const parentIndex = categories.findIndex(el => el.id === category.parent_id);
      if (!categories[parentIndex].children) {
        return categories[parentIndex].children = [category];
      }
      categories[parentIndex].children.push(category);

    });
    return root;
  }

  /**
   * Description: This method will store the categories.
   * @description This method will store the categories.
   * @return array of category object
   */
  async createCategories() {
    const _categories = migrationData['categories'];
    // for (const _category of _categories) {
    //   await this.createCategory(_category, 0);
    // }
    const promises = _categories.map(
      async _category => {
        return await this.createCategory(_category, 0);
      }
    );
    const categories = await Promise.all(promises);
    return categories;
  }

  /**
   * Description: This method will store the category.
   * @description This method will store the category.
   * @param category object of category
   * @param parent_id number
   * @return category object
   */
  async createCategory(category: { name: string, id: number, subcategories?: [] }, parent_id: number) {
    this.saveCategory(category.name, category.id, parent_id);
    if (('subcategories' in category) && category.subcategories.length > 0) {
      const promises = category.subcategories.map(
        async _subcategories => {
          return await this.createCategory(_subcategories, category.id);
        }
      );
      const subCategories = await Promise.all(promises);
      return subCategories;
    }
  }

  /**
   * Description: This method will store the category.
   * @description This method will store the category.
   * @param name string
   * @param id number
   * @param parent_id number
   * @return category object
   */
  async saveCategory(name: string, id: number, parent_id: number) {
    const status: status_enum = '1';
    const payload = { id: id, name: name, parent_id: parent_id, status: status }
    const checkDuplicateCategory = await this.categoryRepository.find(
      { where: { name: name, parent_id: parent_id } }
    );
    if (checkDuplicateCategory && checkDuplicateCategory.length > 0) {
      return false;
    } else {
      return await this.categoryRepository.save(payload);
    }
  }

  /**
   * Description: This method will return the biolabs sources list.
   * @description This method will return the biolabs sources list.
   * @param payload MasterPayload[]
   * @return array of biolabs sources object
   */
  async getBiolabsSource(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    return await this.biolabsSourceRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will store the biolabs sources.
   * @description This method will store the biolabs sources.
   * @return array of biolabs sources object
   */
  async createBiolabsSources() {
    const biolabsSources = this.getBiolabsSource(new MasterPayload());
    let resp = {};
    return await biolabsSources.then(async data => {
      const _biolabsSources = migrationData['biolabsSources'];
      for (const _biolabsSource of _biolabsSources) {
        if (!data.find(r => r.name == _biolabsSource.name)) {
          resp[_biolabsSource.name] = await this.createBiolabsSource(_biolabsSource.name, _biolabsSource.id);
        }
        if (_biolabsSource.name == _biolabsSources[_biolabsSources.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    });
  }

  /**
   * Description: This method will store the biolabs source.
   * @description This method will store the biolabs source.
   * @param name string
   * @param id number
   * @return biolabs source object
   */
  async createBiolabsSource(name: string, id: number) {
    const status: status_enum = '1';
    const payload = {
      id, name, status
    }
    return await this.biolabsSourceRepository.save(this.biolabsSourceRepository.create(payload));
  }

  /**
   * Description: This method will return the fundings list.
   * @description This method will return the fundings list.
   * @param payload MasterPayload[]
   * @return array of fundings object
   */
  async getFundings(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    return await this.fundingRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will store the fundings.
   * @description This method will store the fundings.
   * @return array of fundings object
   */
  async createFundings() {
    const fundings = this.getFundings(new MasterPayload());
    let resp = {};
    return await fundings.then(async data => {
      const _fundings = migrationData['fundings'];
      for (const _funding of _fundings) {
        if (!data.find(r => r.name == _funding.name)) {
          resp[_funding.name] = await this.createFunding(_funding.name, _funding.id);
        }
        if (_funding.name == _fundings[_fundings.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    });
  }

  /**
   * Description: This method will store the funding.
   * @description This method will store the funding.
   * @param name string
   * @param id number
   * @return funding object
   */
  async createFunding(name: string, id: number) {
    const status: status_enum = '1';
    const payload = {
      id, name, status
    }
    return await this.fundingRepository.save(this.fundingRepository.create(payload));
  }

  /**
   * Description: This method will return the modalities list.
   * @description This method will return the modalities list.
   * @param payload MasterPayload[]
   * @return array of modalities object
   */
  async getModalities(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    return await this.modalityRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will store the modalities.
   * @description This method will store the modalities.
   * @return array of modalities object
   */
  async createModalities() {
    const modalities = this.getModalities(new MasterPayload());
    let resp = {};
    return await modalities.then(async data => {
      const _modalities = migrationData['modalities'];
      for (const _modalitie of _modalities) {
        if (!data.find(r => r.name == _modalitie.name)) {
          resp[_modalitie.name] = await this.createModality(_modalitie.name, _modalitie.id);
        }
        if (_modalitie.name == _modalities[_modalities.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    });
  }

  /**
   * Description: This method will store the modality.
   * @description This method will store the modality.
   * @param name string
   * @param id number
   * @return modality object
   */
  async createModality(name: string, id: number) {
    const status: status_enum = '1';
    const payload = {
      id, name, status
    }
    return await this.modalityRepository.save(this.modalityRepository.create(payload));
  }

  /**
   * Description: This method will return the technology stages list.
   * @description This method will return the technology stages list.
   * @param payload MasterPayload[]
   * @return array of technology stages object
   */
  async getTechnologyStages(payload: MasterPayload) {
    let search;
    let skip;
    let take;
    if (payload.q && payload.q != "") {
      search = [{ name: Like("%" + payload.q + "%"), status: '1' }]
    } else {
      search = [{ status: '1' }]
    }
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
    return await this.technologyStageRepository.find({
      select: ["id", "name"],
      where: search,
      skip,
      take
    });
  }

  /**
   * Description: This method will store the technology stages list.
   * @description This method will store the technology stages list.
   * @return array of technology stages object
   */
  async createTechnologyStages() {
    const technologyStages = this.getTechnologyStages(new MasterPayload());
    let resp = {};
    return await technologyStages.then(async data => {
      const _technologyStages = migrationData['companyStages'];
      for (const _technologyStage of _technologyStages) {
        if (!data.find(r => r.name == _technologyStage.name)) {
          resp[_technologyStage.name] = await this.createTechnologyStage(_technologyStage.name, _technologyStage.id);
        }
        if (_technologyStage.name == _technologyStages[_technologyStages.length - 1]) {
          return resp;
        }
      }
    }, error => {
      if (error)
        return;
    });
  }

  /**
   * Description: This method will store the technology stage.
   * @description This method will store the technology stage.
   * @param name string
   * @param id number
   * @return technology stages object
   */
  async createTechnologyStage(name: string, id: number) {
    const status: status_enum = '1';
    const payload = {
      id, name, status
    }
    return await this.technologyStageRepository.save(this.technologyStageRepository.create(payload));
  }

  /**
   * Description: This method will return the company status list.
   * @description This method will return the company status list.
   * @return array of company status object
   */
  getCompanyStatus() {
    return COMPANY_STATUS;
  }

  /**
   * Description: This method will return the user types list.
   * @description This method will return the user types list.
   * @return array of user type object
   */
  getUserTypes() {
    return USER_TYPE;
  }

  /**
   * Description: used to convert data into array
   * @description used to convert data into array
   * @param val input value
   */
  private parseToArray(val) {
    if (typeof val === 'object') {
      return val;
    }
    return [Number(val)];
  }

  /**
   * Description: This method will return the committee status type list.
   * @description This method will return the committee status type list.
   * @return array of COMMITTEE_STATUS object
   */
  getCommitteeStatus() {
    return COMMITTEE_STATUS;
  }
}