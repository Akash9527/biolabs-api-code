import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { diff } from 'json-diff';
import { In, Like, Repository } from 'typeorm';
import { BiolabsSource } from './biolabs-source.entity';
import { Category } from './category.entity';
import { Funding } from './funding.entity';
import { MasterPayload } from './master.payload';
import { Modality } from './modality.entity';
import { Role } from './role.entity';
import { Site } from './site.entity';
import { TechnologyStage } from './technology-stage.entity';
import { COMPANY_STATUS } from '../../../constants/company-status';
import { USER_TYPE } from '../../../constants/user-type';
import { COMMITTEE_STATUS } from 'constants/committee_status';
import { ProductType } from '../order/model/product-type.entity';
import { FileService } from '../file';
const { error, info, debug } = require("../../../utils/logger")
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');
//const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/" + process.env.BIOLAB_CONFIGURATION_JSON));
type status_enum = '-1' | '0' | '1' | '99';
const appRoot = require('app-root-path');

@Injectable()
export class MasterService {
  constructor(
    private readonly fileService: FileService,
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
    info("Getting site by Name: " + payload.q, __filename, "createSite()");
    try {
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
        where: search,
        order: { ['name']: 'ASC' },
        skip,
        take
      });
    } catch (err) {
      error("Error in finding sites" + err.message, __filename, "getSites()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the Product information.
   * @description This method will store the Product information.
   * @return array of product object 
   */
  async createProductType(migrationData: any) {
    info("creating product type", __filename, "createProductType()");
    try {
      const productType = await this.productTypeRepository.find();
      const ptypeData = migrationData["productTypeName"]
      if (!productType || productType.length == 0) {
        for (let index = 0; index < ptypeData.length; index++) {
          const productType = ptypeData[index];
          await this.productTypeRepository.save(this.productTypeRepository.create(productType));
        }
      }
    } catch (err) {
      error("Error in creating product type" + err.message, __filename, "createSite()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will store the sites.
   * @description This method will store the sites.
   * @return array of site object
   */
  async createSites(migrationData: any) {
    const _sites = migrationData['sites'];
    let resp = {};
    for (const _site of _sites) {
      resp[_site.name] = await this.createSite(_site);
    }
    return resp;
  }

  /**
   * Description: This method will store the site.
   * @description This method will store the site.
   * @param site site data object
   * @return site object
   */
  async createSite(_site: Site) {
    // const existingSite = await this.siteRepository.findOne(_site.id);
    // if (existingSite) {
    //   delete existingSite.createdAt;
    //   delete existingSite.updatedAt;
    // }
    // // Will compare 2 json and get the difference
    // const changes = diff(existingSite, _site);
    // if (existingSite && changes) {
    //   return await this.siteRepository.update(_site.id, _site);
    // } else if (!existingSite) {
      return await this.siteRepository.save(this.siteRepository.create(_site));
    // }
  }

  /**
   * Description: This method will return the roles list.
   * @description This method will return the roles list.
   * @param payload MasterPayload[]
   * @return array of roles object
   */
  async getRoles(payload: MasterPayload) {
    info("Getting roles by Name: " + payload.q, __filename, "getRoles()")
    try {
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
    } catch (err) {
      error("Error in getting roles" + err.message, __filename, "getRoles()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the roles.
   * @description This method will store the roles.
   * @return array of role object
   */
  async createRoles(migrationData: any) {
    info("Creating Roles", __filename, "createRoles()");
    const roles = this.getRoles(new MasterPayload());
    let resp = {};
    return await roles.then(async data => {
      const _roles = migrationData['roles'];
      for (const _role of _roles) {
        if (!data.find(r => r.name == _role.name)) {
          resp[_role.name] = await this.createRole(_role.name, _role.id);
        }
        if (_role.name == _roles[_roles.length - 1].name) {
          return resp;
        }
      }
    }, error => {
      if (error)
        error("Error in creating Roles", __filename, "createRoles()");
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
    info("creating Role by Name" + name, __filename, "createRole()");
    try {
      const status: status_enum = '1';
      const payload = {
        id, name, status
      }
      return await this.roleRepository.save(this.roleRepository.create(payload));
    } catch (err) {
      error("Error in creating Role" + err.message, __filename, "createRole()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will return the categories list.
   * @description This method will return the categories list.
   * @param payload MasterPayload[]
   * @return array of categories object
   */
  async getCategories(payload: MasterPayload) {
    info("Getting categories by Name: " + payload.q, __filename, "getCategories()");
    try {
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
    } catch (err) {
      error(err.message, __filename, "getCategories()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the categories.
   * @description This method will store the categories.
   * @return array of category object
   */
  async createCategories(migrationData: any) {
    info("creating categories", __filename, "createCategories()");
    try {
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
    } catch (err) {
      error("Error in creating categories" + err.message, __filename, "createCategories()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will store the category.
   * @description This method will store the category.
   * @param category object of category
   * @param parent_id number
   * @return category object
   */
  async createCategory(category: { name: string, id: number, subcategories?: [] }, parent_id: number) {
    info("creating category", __filename, "createCategory()");
    try {
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
    } catch (err) {
      error("Error in creating category", __filename, "createCategory()");
      throw new InternalException(err.message);
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
    info("creating category by Name: " + name, __filename, "saveCategory()");
    try {
      const status: status_enum = '1';
      const payload = { id: id, name: name, parent_id: parent_id, status: status }
      const checkDuplicateCategory = await this.categoryRepository.find(
        { where: { name: name, parent_id: parent_id } }
      );
      if (checkDuplicateCategory && checkDuplicateCategory.length > 0) {
        debug("Category already existed", __filename, "saveCategory()");
        return false;
      } else {
        return await this.categoryRepository.save(payload);
      }
    } catch (err) {
      error("Error in creating category", __filename, "saveCategory()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will return the biolabs sources list.
   * @description This method will return the biolabs sources list.
   * @param payload MasterPayload[]
   * @return array of biolabs sources object
   */
  async getBiolabsSource(payload: MasterPayload) {
    info("Getting Biolabs Sources by Name: " + payload.q, __filename, "getBiolabsSource()");
    try {
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
    } catch (err) {
      error("Error in find Biolabs source", __filename, "getBiolabsSource()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the biolabs sources.
   * @description This method will store the biolabs sources.
   * @return array of biolabs sources object
   */
  async createBiolabsSources(migrationData: any) {
    info("Creating Biolabs Sources", __filename, "creatBiolabsSources()");
    const biolabsSources = this.getBiolabsSource(new MasterPayload());
    let resp = {};
    return await biolabsSources.then(async data => {
      const _biolabsSources = migrationData['biolabsSources'];
      for (const _biolabsSource of _biolabsSources) {
        if (!data.find(r => r.name == _biolabsSource.name)) {
          resp[_biolabsSource.name] = await this.createBiolabsSource(_biolabsSource.name, _biolabsSource.id);
        }
        if (_biolabsSource.name == _biolabsSources[_biolabsSources.length - 1].name) {
          return resp;
        }
      }
    }, error => {
      if (error)
        error("Error in creating Biolabs Sources", __filename, "createBiolabsSources()");
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
    info("creating Biolabs sources by Name" + name + " Id: " + id, __filename, "createBiolabsSource()");
    try {
      const status: status_enum = '1';
      const payload = {
        id, name, status
      }
      return await this.biolabsSourceRepository.save(this.biolabsSourceRepository.create(payload));
    } catch (err) {
      error("Error in Creating Biolabs sources", __filename, "createBiolabsSource()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will return the fundings list.
   * @description This method will return the fundings list.
   * @param payload MasterPayload[]
   * @return array of fundings object
   */
  async getFundings(payload: MasterPayload) {
    info("Getting Fundings by Name: " + payload.q, __filename, "getFundings()");
    try {
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
    } catch (err) {
      error("Error in find Fundings", __filename, "getFundings()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the fundings.
   * @description This method will store the fundings.
   * @return array of fundings object
   */
  async createFundings(migrationData: any) {
    error("creating fundings", __filename, "createFundings()");
    const fundings = this.getFundings(new MasterPayload());
    let resp = {};
    return await fundings.then(async data => {
      const _fundings = migrationData['fundings'];
      for (const _funding of _fundings) {
        if (!data.find(r => r.name == _funding.name)) {
          resp[_funding.name] = await this.createFunding(_funding.name, _funding.id);
        }
        if (_funding.name == _fundings[_fundings.length - 1].name) {
          return resp;
        }
      }
    }, error => {
      if (error)
        error("Error in delete Order product", __filename, "createFundings()");
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
    info("creating fundings by Name: " + name, __filename, "createFunding()");
    try {
      const status: status_enum = '1';
      const payload = {
        id, name, status
      }
      return await this.fundingRepository.save(this.fundingRepository.create(payload));
    } catch (err) {
      error("Error in creating funding", __filename, "createFunding()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will return the modalities list.
   * @description This method will return the modalities list.
   * @param payload MasterPayload[]
   * @return array of modalities object
   */
  async getModalities(payload: MasterPayload) {
    info("Getting modalities by Name: " + payload.q, __filename, "getModalities()");
    try {
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
    } catch (err) {
      error("Error in finding modalities", __filename, "getModalities()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the modalities.
   * @description This method will store the modalities.
   * @return array of modalities object
   */
  async createModalities(migrationData: any) {
    info("creating Modalities", __filename, "createModalities()");
    const modalities = this.getModalities(new MasterPayload());
    let resp = {};
    return await modalities.then(async data => {
      const _modalities = migrationData['modalities'];
      for (const _modalitie of _modalities) {
        if (!data.find(r => r.name == _modalitie.name)) {
          resp[_modalitie.name] = await this.createModality(_modalitie.name, _modalitie.id);
        }
        if (_modalitie.name == _modalities[_modalities.length - 1].name) {
          return resp;
        }
      }
    }, error => {
      if (error)
        error("Error in creating modalities", __filename, "createModalities()");
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
    info("creating modality by Name: " + name, __filename, "createModality()");
    try {
      const status: status_enum = '1';
      const payload = {
        id, name, status
      }
      return await this.modalityRepository.save(this.modalityRepository.create(payload));
    } catch (err) {
      error("Error in delete Order product", __filename, "createModality()");
      throw new InternalException(err.message);
    }
  }

  /**
   * Description: This method will return the technology stages list.
   * @description This method will return the technology stages list.
   * @param payload MasterPayload[]
   * @return array of technology stages object
   */
  async getTechnologyStages(payload: MasterPayload) {
    info("Getting technology stages by Name:" + payload.q, __filename, "getTechnologyStages()");
    try {
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
      })
    } catch (err) {
      error("Error in finding technology stages", __filename, "deleteOrderProduct()");
      throw new BiolabsException(err.message);
    }
  }

  /**
   * Description: This method will store the technology stages list.
   * @description This method will store the technology stages list.
   * @return array of technology stages object
   */
  async createTechnologyStages(migrationData: any) {
    info("creating Technology Stages", __filename, "createTechnologyStages()");
    const technologyStages = this.getTechnologyStages(new MasterPayload());
    let resp = {};
    return await technologyStages.then(async data => {
      const _technologyStages = migrationData['companyStages'];
      for (const _technologyStage of _technologyStages) {
        if (!data.find(r => r.name == _technologyStage.name)) {
          resp[_technologyStage.name] = await this.createTechnologyStage(_technologyStage.name, _technologyStage.id);
        }
        if (_technologyStage.name == _technologyStages[_technologyStages.length - 1].name) {
          return resp;
        }
      }
    }, error => {
      if (error)
        error("Error in creating Technology stages", __filename, "createTechnologyStages()");
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
    info("Creating Technology Stage by Name:" + name, __filename, "createTechnologyStage()")
    try {
      const status: status_enum = '1';
      const payload = {
        id, name, status
      }
      return await this.technologyStageRepository.save(this.technologyStageRepository.create(payload));
    } catch (err) {
      error("Error in creating technology stage", __filename, "createTechnologyStage()");
      throw new InternalException(err.message);
    }
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
    info("parsing to array", __filename, "parseToArray()")
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

  /**
   * Description this function is used to read migration JSON from Azure.
   * @description this function is used to read migration JSON from Azure.
   * @returns file Data
   */
  async readMigrationJson() {
    if (process.env.BIOLAB_GET_MASTER_DATA_FROM_AZURE == 'false') {
      return JSON.parse(require("fs").readFileSync(appRoot.path + "/" + process.env.BIOLAB_CONFIGURATION_JSON));
    } else {
      const readableStream = await this.fileService.getfileStream(process.env.BIOLAB_CONFIGURATION_JSON, process.env.BIOLAB_CONFIG_CONTAINER_NAME);
      const chunks = [];
      return new Promise(function (resolve, reject) {
        readableStream.on("data", data => {
          chunks.push(data.toString());
        });
        readableStream.on("end", () => {
          resolve(JSON.parse(chunks.join('').toString()));
        });
        readableStream.on('error', reject);
      });
    }
  }
}