import { HttpException, HttpStatus, Injectable, NotAcceptableException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL } from 'constants/email';
import { In, Like, Repository } from 'typeorm';
import { ApplicationConstants } from 'utils/application-constants';
import { Mail } from '../../../utils/Mail';
import { AddSpaceChangeWaitlistDto } from '../dto/add-space-change-waitlist.dto';
import { UpdateSpaceChangeWaitlistDto } from '../dto/update-space-change-waitlist.dto';
import { UpdateWaitlistPriorityOrderDto } from '../dto/update-waitlist-priority-order.dto';
import { UpdateWaitlistRequestStatusDto } from '../dto/update-waitlist-request-status.dto';
import { Item } from '../entity/item.entity';
import { SpaceChangeWaitlist } from '../entity/space-change-waitlist.entity';
import { MembershipChangeEnum } from '../enum/membership-change-enum';
import { RequestStatusEnum } from '../enum/request-status-enum';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { Modality } from '../master/modality.entity';
import { Site } from '../master/site.entity';
import { TechnologyStage } from '../master/technology-stage.entity';
import { ProductTypeService } from '../order/product-type.service';
import { User } from '../user';
import { AddNotesDto } from './add-notes.dto';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { ListResidentCompanyPayload } from './list-resident-company.payload';
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from './rc-advisory.entity';
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from './rc-documents.entity';
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from './rc-management.entity';
import { Notes } from './rc-notes.entity';
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from './rc-technical.entity';
import { ResidentCompanyHistory } from './resident-company-history.entity';
import { ResidentCompany } from './resident-company.entity';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { UpdateNotesDto } from './update-notes.dto';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';
const { error, warn, info, debug } = require("../../../utils/logger")
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');

@Injectable()
export class ResidentCompanyService {
  constructor(
    @InjectRepository(ResidentCompany)
    private readonly residentCompanyRepository: Repository<ResidentCompany>,
    @InjectRepository(ResidentCompanyHistory)
    private readonly residentCompanyHistoryRepository: Repository<ResidentCompanyHistory>,
    @InjectRepository(ResidentCompanyAdvisory)
    private readonly residentCompanyAdvisoryRepository: Repository<ResidentCompanyAdvisory>,
    @InjectRepository(ResidentCompanyDocuments)
    private readonly residentCompanyDocumentsRepository: Repository<ResidentCompanyDocuments>,
    @InjectRepository(ResidentCompanyManagement)
    private readonly residentCompanyManagementRepository: Repository<ResidentCompanyManagement>,
    @InjectRepository(ResidentCompanyTechnical)
    private readonly residentCompanyTechnicalRepository: Repository<ResidentCompanyTechnical>,
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(BiolabsSource)
    private readonly biolabsSourceRepository: Repository<BiolabsSource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Funding)
    private readonly fundingRepository: Repository<Funding>,
    @InjectRepository(Modality)
    private readonly modalityRepository: Repository<Modality>,
    @InjectRepository(TechnologyStage)
    private readonly technologyStageRepository: Repository<TechnologyStage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notes)
    private readonly notesRepository: Repository<Notes>,
    @InjectRepository(SpaceChangeWaitlist)
    private readonly spaceChangeWaitlistRepository: Repository<SpaceChangeWaitlist>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly mail: Mail,
    private readonly productTypeService: ProductTypeService
  ) { }
  /**
   * Description: This method will get the resident company by id.
   * @description This method will get the resident company by id.
   * @param id number resident company id
   * @return resident company object
   */
  async get(id: number) {
    info("Getting Resindent Comapny information by Company ID :" + id, __filename, "get()");
    return this.residentCompanyRepository.findOne(id);
  }

  /**
 * Description: This method is used to update the resident company pitchdeck and logo.
 * @description This method is used to update the  resident company pitchdeck and logo.
 * @param payload object of user information with pitchdeckImgUrl or logoImgUrl
 * @return resident company object
 */
  async updateResidentCompanyImg(payload) {
    info("Updating Resident company image by Company ID :" + payload.id, __filename, "updateResidentCompanyImg()");
    const companyId = payload.id;
    const resident = await this.get(companyId);
    if (resident) {
      if (payload.fileType == 'logo') {
        resident.logoImgUrl = payload.imageUrl;
        await this.residentCompanyRepository.update(companyId, resident);
      } else if (payload.fileType == 'pitchdeck') {
        resident.pitchdeck = payload.imageUrl;
        await this.residentCompanyRepository.update(companyId, resident);
      }
      return resident;
    } else {
      error("resident company with provided id not available.", __filename, "updateResidentCompanyImg()");
      throw new NotAcceptableException('resident company with provided id not available.');
    }
  }

  /**
   * Description: This method will get the resident company by email.
   * @description This method will get the resident company by email.
   * @param email string resident company email
   * @return resident company object
   */
  async getByEmail(email: string) {
    info("Getting user information by user email ID :" + email, __filename, "getByEmail()");
    try {
      return await this.residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', email)
        .getOne();
    } catch (er) {
      error("Getting error in find user by email id " + email, __filename, "getByEmail()");
      throw new BiolabsException(er);
    }
  }

  /**
   * Description: This method will create the new resident companies.
   * @description This method will create the new resident companies.
   * @param payload object of AddResidentCompanyPayload.
   * @return resident companies object
   */
  async create(payload: AddResidentCompanyPayload) {
    info("create Resident Company CompanyName:" + payload.companyName, __filename, "create()");
    const rc = await this.getByEmail(payload.email);

    if (rc) {
      error("User with provided email already created.", __filename, "create()");
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    return await this.residentCompanyRepository.save(this.residentCompanyRepository.create(payload));
  }

  /**
   * Description: This method will create the new resident companies advisor.
   * @description This method will create the new resident companies advisor.
   * @param payload object of ResidentCompanyAdvisoryFillableFields.
   * @return resident companies advisor object
   */
  async addResidentCompanyAdvisor(payload: ResidentCompanyAdvisoryFillableFields) {
    info("adding resident company advisors CompanyId:" + payload.companyId, __filename, "addResidentCompanyAdvisor()");
    if (payload.id)
      await this.residentCompanyAdvisoryRepository.update(payload.id, payload)
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyAdvisor()");
          throw new InternalException(err.message);
        });
    else {
      delete payload.id;
      await this.residentCompanyAdvisoryRepository.save(this.residentCompanyAdvisoryRepository.create(payload))
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyAdvisor()");
          throw new InternalException(err.message);
        });
    }
  }

  /**
   * Description: This method will create the new resident companies advisors.
   * @description This method will create the new resident companies advisors.
   * @param companyMember array of companyMember.
   * @param id number of Company id.
   */
  async residentCompanyAdvisors(Advisors: any, id: number) {
    info("adding resident company advisors", __filename, "residentCompanyAdvisors()");
    if (Advisors.length > 0) {
      for (let i = 0; i < Advisors.length; i++) {
        let advisor: any = Advisors[i];
        advisor.companyId = id;
        if (this.checkEmptyVal('advisors', advisor)) {
          await this.addResidentCompanyAdvisor(advisor);
        }
      }
    }
  }

  /**
   * Description: This method will create the new resident companies document.
   * @description This method will create the new resident companies document.
   * @param payload object of ResidentCompanyDocumentsFillableFields.
   * @return resident companies document object
   */
  async addResidentCompanyDocument(payload: ResidentCompanyDocumentsFillableFields) {
    info(`Adding Resident company document CompanyId: ${payload.company_id}`, __filename, "addResidentCompanyDocument()");
    try {
      const savedRcDocument = await this.residentCompanyDocumentsRepository.save(this.residentCompanyDocumentsRepository.create(payload));
      return savedRcDocument;
    } catch (err) {
      error("Error in adding resident company document", __filename, "addResidentCompanyDocument()");
      throw new InternalException('Error in adding resident company document');
    }
  }

  /**
   * Description: This method will create the new resident companies management.
   * @description This method will create the new resident companies management.
   * @param payload object of ResidentCompanyManagementFillableFields.
   * @return resident companies management object
   */
  async addResidentCompanyManagement(payload: ResidentCompanyManagementFillableFields) {
    info(`Adding Resident company management by companyId:` + payload.companyId, __filename, "addResidentCompanyManagement()");
    if (payload.id)
      await this.residentCompanyManagementRepository.update(payload.id, payload)
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyManagement()");
          throw new InternalException(err.message);
        });
    else {
      delete payload.id;
      await this.residentCompanyManagementRepository.save(this.residentCompanyManagementRepository.create(payload))
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyManagement()");
          throw new InternalException(err.message);
        });
    }
  }

  /**
   * Description: This method will create the new resident companies managements.
   * @description This method will create the new resident companies managements.
   * @param companyMember array of company magmt Member.
   * @param id number of Company id.
   */
  async residentCompanyManagements(companyMembers: any, id: number) {
    info(`resident company management`, __filename, "residentCompanyManagements()");
    if (companyMembers.length > 0) {
      for (let i = 0; i < companyMembers.length; i++) {
        let companyMember: any = companyMembers[i];
        companyMember.companyId = id;
        if (this.checkEmptyVal('managements', companyMember)) {
          await this.addResidentCompanyManagement(companyMember);
        }
      }
    }
  }
  /**
   * Description: This method will create the new resident companies technical.
   * @description This method will create the new resident companies technical.
   * @param payload object of ResidentCompanyTechnicalFillableFields.
   * @return resident companies technical object
   */
  async addResidentCompanyTechnical(payload: ResidentCompanyTechnicalFillableFields) {
    info(`Add resident company technical`, __filename, "addResidentCompanyTechnical()");
    if (payload.id)
      await this.residentCompanyTechnicalRepository.update(payload.id, payload)
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyTechnical()");
          throw new InternalException(err.message);
        });
    else {
      delete payload.id;
      await this.residentCompanyTechnicalRepository.save(this.residentCompanyTechnicalRepository.create(payload))
        .catch(err => {
          error(err.message, __filename, "addResidentCompanyTechnical()");
          throw new InternalException(err.message)
        });
    }
  }

  /**
   * Description: This method will create the new resident companies technicals.
   * @description This method will create the new resident companies technicals.
   * @param companyMember array of technical Member.
   * @param id number of Company id.
   */
  async residentCompanyTechnicals(techMembers: any, id: number) {
    info("Error in find resident companies", __filename, "residentCompanyTechnicals()");
    if (techMembers.length > 0) {
      for (let i = 0; i < techMembers.length; i++) {
        let techMember: any = techMembers[i];
        techMember.companyId = id;
        if (this.checkEmptyVal('technicals', techMember)) {
          await this.addResidentCompanyTechnical(techMember);
        }
      }
    }
  }

  /**
   * Description: This method will create the new resident companies.
   * @description This method will create the new resident companies.
   * @param payload object of AddResidentCompanyPayload.
   * @param req object of Request.
   * @return resident companies object
   */
  async addResidentCompany(payload: AddResidentCompanyPayload, req: Request) {
    info("Adding resident company " + payload.companyName, __filename, "addResidentCompany()");
    const rc = await this.getByEmail(payload.email);
    const sites = payload.site;
    if (rc) {
      error("User with provided email already created.", __filename, "addResidentCompany()");
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    let response = {};
    let savedResidentCompanyId: number;

    try {
      for await (const site of payload.site) {
        payload.site = [site];
        const newRc = await this.residentCompanyRepository.create(payload);
        const savedRc = await this.residentCompanyRepository.save(newRc);
        if (savedRc.id) {
          savedResidentCompanyId = savedRc.id;
          const historyData: any = JSON.parse(JSON.stringify(savedRc));
          historyData.comnpanyId = savedRc.id;
          delete historyData.id;
          await this.residentCompanyHistoryRepository.save(historyData);

          /** Create waitlist entry while saving Resident Company */
          await this.addResidentCompanyDataInWaitlist(savedRc);
        }
      }
      await this.sendEmailToSiteAdmin(sites, req, payload.companyName, savedResidentCompanyId, ApplicationConstants.EMAIL_FOR_RESIDENT_COMPANY_FORM_SUBMISSION);
    } catch {
      response['status'] = 'error';
      response['message'] = 'Could not add application';
      error("Error in add resident company", __filename, "addResidentCompany()");
      throw new InternalException('Error in add resident company');
    }

    response['status'] = 'success';
    response['message'] = 'Application Successfully submitted'
    return response;
  }

  /**
   * Description: This method will notify site admin on new application submission via email.
   * @description This method will notify site admin on new application submission via email.
   * @param site array of sites.
   * @param req object of Request.
   * @param companyName name of the company for which application is submitted.
   * @param companyId id of the company.
   */
  public async sendEmailToSiteAdmin(site: any, req, companyName: string, companyId: number, mailForWhat: string) {
    info("Sending email to site admin", __filename, "sendEmailToSiteAdmin()");

    try {
      let siteAdminEmails = [];
      let userInfo;
      let siteList = [];
      let primarySite = [];
      let sitesApplied = [];

      let siteAdmin: any = await this.userRepository
        .createQueryBuilder('users')
        .select('users.email', 'email')
        .addSelect("string_agg(s.name::text, ',')", 'siteName')
        .leftJoin('sites', 's', 's.id = Any(users.site_id)')
        .where('users.role = 2')
        .andWhere("users.status = '1'")
        .andWhere("s.id = Any(:siteArray)", { siteArray: site })
        .groupBy('users.email')
        .getRawMany();

      for await (let s of site) {
        await this.siteRepository
          .query(`select name as siteName from sites where id = ${s}`).then(res => {
            siteList.push(res[0].sitename);
          });
      }

      for await (const admin of siteAdmin) {
        siteAdminEmails.push({
          emailAddress: {
            address: admin['email']
          },
        });
      }
      for (let s in req.body.primarySite) {
        await this.siteRepository
          .query(`select name as siteName from sites where id = ${req.body.primarySite[s]}`).then(res => {
            primarySite.push(res[0].sitename);
          });
      }
      
      for (let s in req.body.sitesApplied) {
        await this.siteRepository
          .query(`select name as siteName from sites where id = ${req.body.sitesApplied[s]}`).then(res => {
            sitesApplied.push(res[0].sitename);
          });
      }
      
      userInfo = {
        token: req.headers.authorization,
        company_name: companyName,
        site_name: siteList,
        origin: req.headers['origin'],
        companyId: companyId,
        primarySite: primarySite,
        sitesApplied: sitesApplied
      };
      debug(`userInfo.origin: ${userInfo.origin}`, __filename, `sendEmailToSiteAdmin()`);

      let contentParam;
      if (mailForWhat == ApplicationConstants.EMAIL_FOR_RESIDENT_COMPANY_FORM_SUBMISSION) {
        EMAIL.SUBJECT_FORM = ApplicationConstants.EMAIL_SUBJECT_FOR_RESIDENT_COMPANY_FORM_SUBMISSION;
        contentParam = ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_RESIDENT_COMPANY_FORM_SUBMISSION;
      } else if (mailForWhat == ApplicationConstants.EMAIL_FOR_SPACE_CHANGE_REQUEST_SUBMITTED) {
        EMAIL.SUBJECT_FORM = ApplicationConstants.EMAIL_SUBJECT_FOR_SPACE_CHANGE_REQUEST_SUBMITTED;
        contentParam = ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_SPACE_CHANGE_REQUEST_SUBMITTED;
      } else if (mailForWhat == ApplicationConstants.EMAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES) {
        EMAIL.SUBJECT_FORM = ApplicationConstants.EMAIL_SUBJECT_FOR_SPONSORSHIP_QN_CHANGE_TO_YES;
        contentParam = ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_SPONSORSHIP_QN_CHANGE_TO_YES;
      }
      debug(`EMAIL.SUBJECT_FORM: ${EMAIL.SUBJECT_FORM}`, __filename, `sendEmailToSiteAdmin()`);

      await this.mail.sendEmail(siteAdminEmails, EMAIL.SUBJECT_FORM, contentParam, userInfo);
    } catch (err) {
      error("Error in sending email to site admin", __filename, "sendEmailToSiteAdmin()");
      throw new InternalException('Error in sending email to site admin' + err.message);
    }
  }

  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async getResidentCompanies(payload: ListResidentCompanyPayload, siteIdArr: number[]) {
    info("Getting resident companies by name:" + payload.q, __filename, "getResidentCompanies()");
    try {
      let rcQuery = await this.residentCompanyRepository.createQueryBuilder("resident_companies")
        .select("resident_companies.* ")
        .addSelect("s.name", "siteName")
        .addSelect("s.id", "siteId")
        .leftJoin('sites', 's', 's.id = Any(resident_companies.site)')
        .where("resident_companies.status IN (:...status)", { status: [1, 0] });

      if (siteIdArr && siteIdArr.length) {
        rcQuery.andWhere("resident_companies.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
      }
      if (payload.q && payload.q != '') {
        rcQuery.andWhere("(resident_companies.companyName LIKE :name) ", { name: `%${payload.q}%` });
      }
      if (payload.companyStatus && payload.companyStatus.length > 0) {
        rcQuery.andWhere("resident_companies.companyStatus = :companyStatus", { companyStatus: payload.companyStatus });
      }
      if (typeof payload.companyVisibility !== 'undefined') {
        rcQuery.andWhere("resident_companies.companyVisibility = :companyVisibility", { companyVisibility: payload.companyVisibility });
      }
      if (typeof payload.companyOnboardingStatus !== 'undefined') {
        rcQuery.andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: payload.companyOnboardingStatus });
      }
      if (typeof payload.committeeStatus !== 'undefined') {
        rcQuery.andWhere("resident_companies.committeeStatus = :committeeStatus", { committeeStatus: payload.committeeStatus });
      }

      if (typeof payload.sortBy !== 'undefined') {
        if (payload.sortBy == 'alpha') {
          rcQuery.orderBy("resident_companies.companyName", "ASC");
        }
        if (payload.sortBy == 'date') {
          rcQuery.orderBy("resident_companies.companyStatusChangeDate", "DESC");
        }
      } else {
        rcQuery.orderBy("id", "DESC");
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
        rcQuery.skip(skip).take(take)
      }
      return await rcQuery.getRawMany();
    } catch (err) {
      error("Error in find resident companies", __filename, "getResidentCompanies()");
      throw new BiolabsException('Error in find resident companies' + err.message);
    }
  }

  /**
   * Description: This method will return a resident company by id.
   * @description This method will return a resident company by id.
   * @param payload an id of ResidentCompany
   * @return an objecdt of ResidentCompany
   */
  public async getResidentCompanySpecificFieldsById(residentCompanyId: number, @Request() req) {
    info(`Get some specific fields of Resident Company by company Id: ${residentCompanyId}`, __filename, `getResidentCompanySpecificFieldsById()`);

    let siteIdArr;

    /** Check if user has permission to view this company */
    this.CheckCompanyPermissionForUser(req, residentCompanyId);
    siteIdArr = this.getSiteIdArrFromRequestObject(req);

    let response = {};
    let residentCompanyObj = await this.fetchResidentCompanyById(residentCompanyId);
    if (residentCompanyObj) {

      /** Check if sites are accessible to the user */
      this.checkIfValidSiteIds(siteIdArr, residentCompanyObj.site);

      response['residentCompanyId'] = residentCompanyObj.id;
      response['companyStageOfDevelopment'] = residentCompanyObj.companyStage;
      response['fundingToDate'] = residentCompanyObj.funding;
      response['fundingSource'] = residentCompanyObj.fundingSource;
      response['TotalCompanySize'] = residentCompanyObj.companySize;
      response['canWeShareYourDataWithSponsorsEtc'] = residentCompanyObj.shareYourProfile;
      return response;
    } else {
      error(`Resident Company not found by company Id: ${residentCompanyId}`, __filename, `getResidentCompanySpecificFieldsById()`);
      throw new NotAcceptableException(
        'Resident Company not found by id: ' + residentCompanyId,
      );
    }
  }

  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async getResidentCompaniesBkp(payload: ListResidentCompanyPayload) {
    info("Getting resident companies BKP", __filename, "getRcFundings()");
    try {
      let search;
      let skip;
      let take;
      let _search = {};
      if (payload.role || payload.role == 0) {
        _search = { ..._search, ...{ role: payload.role } };
      }
      if (payload.q && payload.q != "") {
        _search = { ..._search, ...{ companyName: Like("%" + payload.q + "%") } };
      }
      if (payload.companyStatus && payload.companyStatus.length > 0) {
        _search = { ..._search, ...{ companyStatus: payload.companyStatus } };
      }
      if (typeof payload.companyVisibility !== 'undefined') {
        _search = { ..._search, ...{ companyVisibility: payload.companyVisibility } };
      }
      if (typeof payload.companyOnboardingStatus !== 'undefined') {
        _search = { ..._search, ...{ companyOnboardingStatus: payload.companyOnboardingStatus } };
      }
      search = [{ ..._search, status: In(['1', '0']) }]
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
      return await this.residentCompanyRepository.find({
        where: search,
        order: { id: "DESC" },
        skip,
        take
      });
    } catch (err) {
      error("Error in find resident company for Bkp", __filename, "getResidentCompaniesBkp()");
      throw new BiolabsException('Error in find resident company for Bkp', err.message);
    }
  }

  /**
   * Description: This method will return the sites list.
   * @description This method will return the sites list.
   * @param ids number[]
   * @return array of sites object
   */
  async getRcSites(ids) {
    info("Getting resident company sites", __filename, "getRcSites()");
    if (ids && ids.length > 0) {
      return await this.siteRepository.find({
        select: ["id", "name"],
        where: { id: In(ids) },
      });
    }
    return [];
  }

  /**
   * Description: This method will return the categories list.
   * @description This method will return the categories list.
   * @param ids number[]
   * @return array of categories object
   */
  async getRcCategories(ids) {
    info("Getting resident company categories", __filename, "getRcCategories()");
    if (ids && ids.length > 0) {
      return await this.categoryRepository.find({
        select: ["id", "name"],
        where: { id: In(ids) },
      });
    }
    return [];
  }

  /**
   * Description: This method will return the fundings list.
   * @description This method will return the fundings list.
   * @param ids number[]
   * @return array of fundings object
   */
  async getRcFundings(ids) {
    info("Getting resident company Fundings", __filename, "getRcFundings()");
    if (ids && ids.length > 0) {
      return await this.fundingRepository.find({
        select: ["id", "name"],
        where: { id: In(ids) },
      });
    }
    return [];
  }

  /**
   * Description: This method will return the technology stages list.
   * @description This method will return the technology stages list.
   * @param ids number[]
   * @return array of technology stages object
   */
  async getRcTechnologyStages(ids) {
    info("Getting resident Technology stages", __filename, "getRcTechnologyStages()");
    if (ids) {
      return await this.technologyStageRepository.findOne({
        select: ["id", "name"],
        where: { id: ids },
      });
    }
    return {};
  }

  /**
   * Description: This method will return the biolabs sources list.
   * @description This method will return the biolabs sources list.
   * @param ids number[]
   * @return array of biolabs sources object
   */
  async getRcBiolabsSources(ids) {
    info("Getting resident company Biolabs sources", __filename, "getRcBiolabsSources()");
    if (ids) {
      return await this.biolabsSourceRepository.findOne({
        select: ["id", "name"],
        where: { id: ids },
      });
    }
    return {};
  }

  /**
   * Description: This method will return the modalities list.
   * @description This method will return the modalities list.
   * @param ids number[]
   * @return array of modalities object
   */
  async getRcModalities(ids) {
    info("Getting resident company modalities", __filename, "getRcModalities()");
    if (ids) {
      return await this.modalityRepository.find({
        select: ["id", "name"],
        where: { id: In(ids) },
      });
    }
    return [];
  }

  /**
   * Description: This method will return the management members list.
   * @description This method will return the management members list.
   * @param ids number[]
   * @return array of biolabs sources object
   */
  async getRcMembers(id) {
    info("Getting resident company members", __filename, "getRcMembers()");
    if (id) {
      return await this.residentCompanyManagementRepository.find({
        where: { companyId: id, status: 0 },
      });
    }
    return []
  }

  /**
   * Description: This method will return the advisors members list.
   * @description This method will return the advisors members list.
   * @param ids number[]
   * @return array of biolabs sources object
   */
  async getRcAdvisors(id) {
    info("Getting resident company Advisors", __filename, "getRcAdvisors()");
    if (id) {
      return await this.residentCompanyAdvisoryRepository.find({
        where: { companyId: id, status: 0 },
      });
    }
    return []
  }

  /**
   * Description: This method will return the technical teams members list.
   * @description This method will return the technical teams members list.
   * @param ids number[]
   * @return array of biolabs sources object
   */
  async getRcTechnicalTeams(id) {
    info("Getting resident company technical teams", __filename, "getRcTechnicalTeams()");
    if (id) {
      return await this.residentCompanyTechnicalRepository.find({
        where: { companyId: id, status: 0 },
      });
    }
    return [];
  }

  /**
   * Description: This method will get the resident company for sponsor.
   * @description This method will get the resident company for sponsor.
   * @param id number resident company id
   * @return resident company object
   */
  async getResidentCompanyForSponsor() {
    info("Getting Resident company for Sponser", __filename, "getResidentCompanyForSponser()");
    let response = {};
    try {
      const graduate: any = await this.residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).getRawOne();

      let status = {};
      const count: any = await this.residentCompanyRepository.query("select count(*) from public.resident_companies where resident_companies.\"companyStatus\" = '1' and resident_companies.\"companyOnboardingStatus\" = true");
      if (count && count.length > 0) {
        status["startUpcount"] = count[0]["count"];
      }
      //calculatinng median
      const medainResponse: any = await this.residentCompanyRepository.query("select percentile_cont(0.5) within group ( order by resident_companies.\"companySize\" ) as median from public.resident_companies where resident_companies.\"companySize\" is not null and resident_companies.\"companyStatus\" = '1'  and resident_companies.\"companyOnboardingStatus\" = true");
      if (medainResponse && medainResponse.length > 0) {
        status["avgTeamSize"] = Math.round(medainResponse[0].median);
      }
      const categoryStats = await this.getCategoryCount(0);

      response['companyStats'] = (!status) ? 0 : status;
      response['graduate'] = (!graduate) ? 0 : graduate;
      response['categoryStats'] = (!categoryStats) ? 0 : categoryStats;
    } catch (err) {
      error("Error in find resident company for sponser", err.message, __filename, "getResidentCompanyForSponsor()");
    }
    return response;

  }

  /**
  * Description: This method will get the resident company for sponsor.
  * @description This method will get the resident company for sponsor.
  * @param id number resident company id
  * @return resident company object
  */
  async getResidentCompanyForSponsorBySite() {
    info("Getting Resident company for Sponser by site", __filename, "getResidentCompanyForSponserBySite()");
    let res = [];
    try {
      const sites = await this.siteRepository.find();

      for (let site of sites) {
        let response = {};

        const graduate: any = await this.residentCompanyRepository.
          createQueryBuilder("resident_companies").
          select("count(*)", "graduate").
          where("resident_companies.companyStatus = :status", { status: '4' }).
          andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

        let companystats = {};
        const count: any = await this.residentCompanyRepository.query("select count(*) from public.resident_companies where resident_companies.\"companyStatus\" = '1'  and resident_companies.\"companyOnboardingStatus\" = true and " + site.id + " = Any(\"site\")");
        if (count && count.length > 0) {
          companystats["count"] = count[0]["count"];
        }

        //calculatinng median
        const medainResponse: any = await this.residentCompanyRepository.query("select percentile_cont(0.5) within group ( order by resident_companies.\"companySize\" ) as median from public.resident_companies where resident_companies.\"companySize\" is not null and " + site.id + " = Any(\"site\") and resident_companies.\"companyStatus\" = '1'  and resident_companies.\"companyOnboardingStatus\" = true");
        if (medainResponse && medainResponse.length > 0) {
          companystats["avg"] = Math.round(medainResponse[0].median);
        }

        const categoryStats = await this.getCategoryCount(site.id);

        let newStartUps: any = {};
        newStartUps = await this.residentCompanyRepository.
          query(" select count(*) as newStartUps FROM resident_companies " +
            " where resident_companies.\"companyOnboardingStatus\" = true and " +
            + site.id + "= ANY(resident_companies.\"site\"::int[]) and" +
            " resident_companies.\"companyStatus\" = '1' and " +
            " (CURRENT_DATE - INTERVAL '3 months')  < (resident_companies.\"createdAt\") ");

        // } catch {
        //   newStartUps = {newStartUps : 'error'};
        // }

        response['newStartUps'] = (!newStartUps) ? 0 : newStartUps;
        response['site'] = (!site) ? 0 : site;
        response['graduate'] = (!graduate) ? 0 : graduate;
        response['companyStats'] = (!companystats) ? 0 : companystats;
        response['categoryStats'] = (!categoryStats) ? 0 : categoryStats;
        res.push(response);
      }
    } catch (err) {
      error("Error in find resident company for sponser", err.message, __filename, "getResidentCompanyForSponsorBySite()");
    }
    return res;

  }

  /**
  * @description This method will get top 3 count of resident conpanies associated with industries.
  * @param siteId site id 
  * @returns resident conpanies associated with industries.
  */
  async getCategoryCount(siteId) {
    let siteFilter = "(select count(rc.*) FROM public.resident_companies as rc where rc.\"companyStatus\" = '1'  and rc.\"companyOnboardingStatus\" = true  and p.id = ANY(rc.industry::int[]) ) as industryCount ";
    if (siteId && siteId > 0) {
      siteFilter = "(select count(rc.*) FROM public.resident_companies as rc  where  rc.\"companyStatus\" = '1'  and rc.\"companyOnboardingStatus\" = true and p.id = ANY(rc.industry::int[]) and  " + siteId + " = ANY(rc.site::int[]) ) as industryCount ";
    }
    let query =
      " with CTE as"
      + "("
      + " select p.id,p.parent_id cid,p.name as cname ,p1.parent_id as c1id,p1.name as c1name ,p2.parent_id as c2id, p2.name as c2name,"
      + siteFilter
      + " from public.categories as p left join public.categories as p1 on p1.id=p.parent_id "
      + " left join  public.categories as p2 on p2.id=p1.parent_id "
      + " order by industryCount desc)"
      + ",CTE1 as"
      + "("
      + " select C.c2name as c2name, sum(C.industryCount) as c2count from CTE C"
      + " where C.c2id is not null and C.c2id=0 and C.industryCount>0"
      + " group by C.c2name"
      + ")"
      + ",CTE2 as"
      + "("
      + " select C.c1name as c1name, sum(C.industryCount) as c1count from CTE C"
      + " where C.c1id is not null and C.c1id=0 and C.industryCount>0"
      + " group by C.c1name"
      + ")"
      + ",CTE3  as"
      + "("
      + " select C.cname as cname, sum(C.industryCount) as ccount from CTE C"
      + " where C.cid is not null and C.cid=0 and C.industryCount>0"
      + " group by C.cname"
      + ")"
      + " select c2name as name,c2count as industryCount from CTE1 union "
      + " select c1name,c1count from CTE2 union "
      + " select cname,ccount from CTE3 "
      + " order by industryCount desc;"
    info("Query excecuting ", query, __filename, "getCategoryCount()");
    const categoryStats = await this.categoryRepository.query(query);
    let holder = {};
    categoryStats.forEach(function (d) {
      if (holder.hasOwnProperty(d.name)) {
        holder[d.name] = holder[d.name] + parseInt(d.industrycount);
      } else {
        holder[d.name] = parseInt(d.industrycount);
      }
    });
    let catogaryObj = [];
    for (let prop in holder) {
      if (catogaryObj.length < 3)
        catogaryObj.push({ name: prop, industrycount: holder[prop] });
    }
    return catogaryObj;
  }

  /**
   * Description: This method will get the resident company.
   * @description This method will get the resident company.
   * @param id number resident company id
   * @param req object of Request
   * @return resident company object
   */
  async getResidentCompany(id: number, @Request() req) {
    info("Getting Resident company by id :" + id, __filename, "getResidentCompany()");
    let siteIdArr;

    if (id == null) {
      debug("Resident company is not fonund by id :" + id, __filename, "getResidentCompany()");
      return {};
    }

    /** Check if user has permission to view this company */
    this.CheckCompanyPermissionForUser(req, id);
    siteIdArr = this.getSiteIdArrFromRequestObject(req);
    // try {
    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: id }
    });

    if (residentCompany) {

      info(`Fetched resident company from repository, id : ${residentCompany.id}`, __filename, "getResidentCompany()");
      /** Check if sites are accessible to the user */
      this.checkIfValidSiteIds(siteIdArr, residentCompany.site);

      residentCompany.sites = await this.getRcSites(residentCompany.site);
      residentCompany.primarySiteArray = await this.getRcSites(residentCompany.primarySite);
      residentCompany.sitesAppliedArray = await this.getRcSites(residentCompany.sitesApplied);
      residentCompany.categories = await this.getRcCategories(residentCompany.industry);
      residentCompany.modalities = await this.getRcModalities(residentCompany.modality);
      residentCompany.fundingSources = await this.getRcFundings(residentCompany.fundingSource);
      residentCompany.companyStages = await this.getRcTechnologyStages(residentCompany.companyStage);
      residentCompany.biolabsSources = await this.getRcBiolabsSources(residentCompany.biolabsSources);
      residentCompany.companyMembers = await this.getRcMembers(residentCompany.id);
      residentCompany.companyAdvisors = await this.getRcAdvisors(residentCompany.id);
      residentCompany.companyTechnicalTeams = await this.getRcTechnicalTeams(residentCompany.id);
      return residentCompany;
    } else {
      error("Error in find resident company", __filename, "getResidentCompany()");
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
    // } catch (err) {
    //   error("Error in find resident company", __filename, "getResidentCompany()");
    //   throw new BiolabsException('Error in find resident company', err.message);
    // }
  }

  /**
   * Description: Checks if the company has the site ids which are accessible to the user.
   * @description Checks if the company has the site ids which are accessible to the user.
   * @param siteIdArrReq array
   * @param siteIdArrComp array
   */
  public checkIfValidSiteIds(siteIdArrReq: number[], siteIdArrComp: number[]) {
    info(`Checking company is accessible to the user by site ids  ${siteIdArrReq}`, __filename, "checkIfValidSiteIds()");
    if (siteIdArrReq && siteIdArrComp) {
      let found = false;
      for (let s of siteIdArrComp) {
        if (siteIdArrReq.indexOf(s) >= 0) {
          found = true;
          break;
        }
      }
      if (!found) {
        error(`User does not have permission to access this company`, __filename, `checkIfValidSiteIds()`);
        throw new NotAcceptableException(
          'You do not have permission to view this company',
        );
      }
    }
  }

  /**
   * Description: This method will update the resident company status.
   * @description This method will update the resident company status.
   * @param payload object of type UpdateResidentCompanyStatusPayload
   * @return resident company object
   */
  async updateResidentCompanyStatus(payload: UpdateResidentCompanyStatusPayload) {
    info(`updating resident company status by comapnyId: ${payload.companyId}`, __filename, "updateResidentCompanyStatus()")
    try {
      const residentCompany: any = await this.residentCompanyRepository.findOne({
        where: { id: payload.companyId }
      });
      if (residentCompany) {
        residentCompany.companyStatus = payload.companyStatus;
        residentCompany.companyVisibility = payload.companyVisibility;
        residentCompany.companyOnboardingStatus = payload.companyOnboardingStatus;

        residentCompany.committeeStatus = payload.committeeStatus;
        residentCompany.selectionDate = payload.selectionDate;
        // Checking companyStatusChangeDate is the instanceof Date, then only update.
        if (payload.companyStatusChangeDate && payload.companyStatusChangeDate instanceof Date) {
          residentCompany.companyStatusChangeDate = payload.companyStatusChangeDate;
        }
        if (Number(residentCompany.companyStatus) !== 1) {
          residentCompany.companyOnboardingStatus = false;
          residentCompany.companyVisibility = false;
        }
        this.residentCompanyRepository.update(residentCompany.id, residentCompany);
        const historyData: any = JSON.parse(JSON.stringify(residentCompany));
        historyData.comnpanyId = residentCompany.id;
        delete historyData.id;
        await this.residentCompanyHistoryRepository.save(historyData);
        debug("Resident company updated successfully", __filename, "updateResidentCompanyStatus()");
        return residentCompany;
      } else {
        error(`Company with provided id not available`, __filename, `updateResidentCompanyStatus()`);
        throw new NotAcceptableException(
          'Company with provided id not available.',
        );
      }
    } catch (err) {
      error(`Error in update resident company status`, __filename, `updateResidentCompanyStatus()`);
      throw new InternalException('Error in updating resident company status' + err.message);
    }
  }

  /**
   * Description: This method will update the resident company info.
   * @description This method will update the resident company info.
   * @param payload object of type UpdateResidentCompanyPayload
   * @return resident company object
   */
  async updateResidentCompany(payload: UpdateResidentCompanyPayload, @Request() req) {
    info(`updating resident company id: ${payload.id}`, __filename, "updateResidentCompany()")
    try {
      const residentCompany: any = await this.residentCompanyRepository.findOne({
        where: { id: payload.id }
      });
      let historyData: any = JSON.parse(JSON.stringify(residentCompany));
      // removing dates for history data
      delete historyData.createdAt;
      delete historyData.updatedAt;
      // Not needed anymore because we are saving multiple instance of same application based on siteId
      // const residentCompanyEmailChk: any = await this.residentCompanyRepository.findOne({
      //   where: { id: Not(payload.id), email: payload.email }
      // });
      // if (residentCompanyEmailChk) {
      //   throw new NotAcceptableException(
      //     'User with provided email already existed.',
      //   );
      // }
      if (residentCompany) {
        const companyMembers: any = (payload.companyMembers) ? JSON.parse(JSON.stringify(payload.companyMembers)) : [];
        const companyAdvisors: any = (payload.companyAdvisors) ? JSON.parse(JSON.stringify(payload.companyAdvisors)) : [];
        const companyTechnicalTeams: any = (payload.companyTechnicalTeams) ? JSON.parse(JSON.stringify(payload.companyTechnicalTeams)) : [];

        delete payload.companyMembers;
        delete payload.companyAdvisors;
        delete payload.companyTechnicalTeams;

        await this.residentCompanyRepository.update(residentCompany.id, this.residentCompanyRepository.create(payload));
        await this.residentCompanyManagements(companyMembers, residentCompany.id);
        await this.residentCompanyAdvisors(companyAdvisors, residentCompany.id);
        await this.residentCompanyTechnicals(companyTechnicalTeams, residentCompany.id);

        historyData = { ...historyData, ...payload };
        historyData.comnpanyId = residentCompany.id;
        delete historyData.id;
        await this.residentCompanyHistoryRepository.save(historyData);
        debug("Resident company updated successfully", __filename, "updateResidentCompany()");

        /** BIOL-308: Notify Site Admin if the sponsorship question changes to Yes. shareYourProfile = true */
        if (!residentCompany.shareYourProfile && payload.shareYourProfile) {
          debug(`Sponsor ship contact question changed to: ${payload.shareYourProfile}`, __filename, `updateResidentCompany()`);
          await this.sendEmailToSiteAdmin(payload.site, req, residentCompany.companyName, residentCompany.id, ApplicationConstants.EMAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES);
          info(`Email sent regarding Sponsorship contact question change to Yes`, __filename, `updateResidentCompany()`);
        }
        return await this.getResidentCompany(residentCompany.id, req);
      } else {
        error("Company with provided id not available.", __filename, "updateResidentCompany()");
        throw new NotAcceptableException(
          'Company with provided id not available.',
        );
      }
    } catch (err) {
      error("Error in update resident company", __filename, "updateResidentCompany()");
      throw new InternalException('Error in update resident company', err.message);
    }
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
    return [val];
  }

  /**
   * Description: This method will return the resident companies list.(not in use)
   * @description This method will return the resident companies list.(not in use)
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async gloabalSearchCompaniesOld(payload: SearchResidentCompanyPayload, siteIdArr: number[]) {
    info(`global search companies old`, __filename, "gloabalSearchCompaniesOld()")
    try {
      let rcQuery = await this.residentCompanyRepository.createQueryBuilder("resident_companies")
        .where("resident_companies.status IN (:...status)", { status: [1, 0] });

      if (siteIdArr && siteIdArr.length) {
        rcQuery.andWhere("resident_companies.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
      }

      if (payload.q && payload.q != '') {
        payload.q = payload.q.trim();
        // rcQuery.andWhere("(resident_companies.name LIKE :name) OR (resident_companies.companyName LIKE :name) ", { name: `%${payload.q}%` }); 
        //rcQuery.andWhere("(resident_companies.name LIKE :q) OR (resident_companies.companyName LIKE :q) OR (SELECT to_tsvector(resident_companies.\"name\" || ' ' || resident_companies.\"companyName\" || ' ' || resident_companies.\"technology\") @@ to_tsquery(:q)) ", { q: `%${payload.q}%` });
        rcQuery.andWhere("(LOWER(resident_companies.name) LIKE :q) OR (LOWER(resident_companies.companyName) LIKE :q) OR (LOWER(resident_companies.technology) LIKE :q) OR (LOWER(resident_companies.email) LIKE :q) OR (LOWER(resident_companies.rAndDPath) LIKE :q) OR (LOWER(resident_companies.foundedPlace) LIKE :q) OR (LOWER(resident_companies.affiliatedInstitution) LIKE :q) OR (SELECT to_tsvector(resident_companies.\"name\" || ' ' || resident_companies.\"companyName\" || ' ' || resident_companies.\"technology\" || ' ' || resident_companies.\"email\" || ' ' || resident_companies.\"rAndDPath\" || ' ' || resident_companies.\"foundedPlace\" || ' ' || resident_companies.\"affiliatedInstitution\" ) @@ plainto_tsquery(:q) )", { q: `%${payload.q.toLowerCase()}%` });
      }

      if (payload.companyStatus && payload.companyStatus.length > 0) {
        rcQuery.andWhere("resident_companies.companyStatus = :companyStatus", { companyStatus: payload.companyStatus });
      }

      if (typeof payload.companyVisibility !== 'undefined') {
        rcQuery.andWhere("resident_companies.companyVisibility = :companyVisibility", { companyVisibility: payload.companyVisibility });
      }

      if (typeof payload.companyOnboardingStatus !== 'undefined') {
        rcQuery.andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: payload.companyOnboardingStatus });
      }

      if (payload.siteIdArr && payload.siteIdArr.length > 0) {
        payload.siteIdArr = this.parseToArray(payload.siteIdArr)
        rcQuery.andWhere("resident_companies.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: payload.siteIdArr });
      }

      if (payload.industries && payload.industries.length > 0) {
        payload.industries = this.parseToArray(payload.industries)
        rcQuery.andWhere("resident_companies.industry && ARRAY[:...industries]::int[]", { industries: payload.industries });
      }

      if (payload.modalities && payload.modalities.length > 0) {
        payload.modalities = this.parseToArray(payload.modalities)
        rcQuery.andWhere("resident_companies.modality && ARRAY[:...modalities]::int[]", { modalities: payload.modalities });
      }

      if (payload.fundingSource && payload.fundingSource.length > 0) {
        payload.fundingSource = this.parseToArray(payload.fundingSource)
        rcQuery.andWhere("resident_companies.fundingSource && ARRAY[:...fundingSource]::int[]", { fundingSource: payload.fundingSource });
      }

      if (payload.minFund >= 0) {
        rcQuery.andWhere("resident_companies.funding::int >= :minFunding", { minFunding: payload.minFund });
      }

      if (payload.maxFund >= 0) {
        rcQuery.andWhere("resident_companies.funding::int <= :maxFunding", { maxFunding: payload.maxFund });
      }

      if (payload.minCompanySize >= 0) {
        rcQuery.andWhere("resident_companies.\"companySize\"::int >= :minCompanySize", { minCompanySize: payload.minCompanySize });
      }

      if (payload.maxCompanySize >= 0) {
        rcQuery.andWhere("resident_companies.\"companySize\"::int <= :maxCompanySize", { maxCompanySize: payload.maxCompanySize });
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
        rcQuery.skip(skip).take(take)
      }

      if (payload.sort) {
        rcQuery.orderBy('"' + payload.sortFiled + '"', payload.sortOrder)
      }

      rcQuery.addOrderBy("id", "DESC");
      return await rcQuery.getMany();
    } catch (err) {
      error("Error in search companies old delete user", __filename, "gloabalSearchCompaniesOld()");
      throw new BiolabsException('Error in search companies old', err.message);
    }
  }
  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async gloabalSearchCompanies(payload: SearchResidentCompanyPayload, siteIdArr: number[]) {
    info(`global search companies`, __filename, "gloabalSearchCompanies()")
    try {
      let globalSearch = `SELECT * FROM global_search_view AS gsv`;
      globalSearch += ` where "status" IN ('1', '0')  `;

      if (payload.siteIdArr && payload.siteIdArr.length > 0) {
        payload.siteIdArr = this.parseToArray(payload.siteIdArr)
        globalSearch += ` and gsv."site" && ARRAY[` + payload.siteIdArr + `]::int[] `;
      } else if (siteIdArr && siteIdArr.length) {
        globalSearch += ` and gsv."site" && ARRAY[` + siteIdArr + `]::int[] `;
      }

      if (payload.q && payload.q != '') {
        payload.q = payload.q.trim();
        globalSearch += ` and (
      (LOWER(gsv.\"name\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"companyName\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"technology\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"email\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"rAndDPath\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"foundedPlace\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"affiliatedInstitution\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"fundingsrcname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"industryname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"modalityname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"sitename\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techstagename\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"bsourcesname\") LIKE '%${payload.q.toLowerCase()}%') OR

      (LOWER(gsv.\"companystatustext\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"companyvisibilitytext\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"companyonboardingtext\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"committeestatustext\") LIKE '%${payload.q.toLowerCase()}%') OR


      (LOWER(gsv.\"advisoryname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"advisorytitle\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"advisoryorg\") LIKE '%${payload.q.toLowerCase()}%') OR

      (LOWER(gsv.\"mgmtname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"mgmttitle\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"mgmtphone\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"mgmtlinkedin\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"mgmtpublications\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"mgmtffiliation\") LIKE '%${payload.q.toLowerCase()}%') OR

      (LOWER(gsv.\"techname\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techtitle\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techemail\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techphone\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techlinkedin\") LIKE '%${payload.q.toLowerCase()}%') OR
      (LOWER(gsv.\"techpublications\") LIKE '%${payload.q.toLowerCase()}%') OR
      (SELECT to_tsvector(
        gsv.\"name\" || ' ' || 
        gsv.\"companyName\" || ' ' || 
        gsv.\"technology\" || ' ' || 
        gsv.\"email\" || ' ' || 
        gsv.\"rAndDPath\" || ' ' || 
        gsv.\"foundedPlace\" || ' ' || 
        gsv.\"affiliatedInstitution\" || ' ' ||
        gsv.\"fundingsrcname\" || ' ' ||
        gsv.\"industryname\" || ' ' ||
        gsv.\"modalityname\" || ' ' ||
        gsv.\"sitename\" || ' ' ||
        gsv.\"techstagename\" || ' ' ||
        gsv.\"bsourcesname\" || ' ' ||

        gsv.\"companystatustext\" || ' ' ||
        gsv.\"companyvisibilitytext\" || ' ' ||
        gsv.\"companyonboardingtext\" || ' ' ||
        gsv.\"committeestatustext\" || ' ' ||

        gsv.\"advisoryname\" || ' ' ||
        gsv.\"advisorytitle\" || ' ' ||
        gsv.\"advisoryorg\" || ' ' ||

        gsv.\"mgmtname\" || ' ' ||
        gsv.\"mgmttitle\" || ' ' ||
        gsv.\"mgmtphone\" || ' ' ||
        gsv.\"mgmtlinkedin\" || ' ' ||
        gsv.\"mgmtpublications\" || ' ' ||
        gsv.\"mgmtffiliation\" || ' ' ||

        gsv.\"techname\" || ' ' ||
        gsv.\"techtitle\" || ' ' ||
        gsv.\"techemail\" || ' ' ||
        gsv.\"techphone\" || ' ' ||
        gsv.\"techlinkedin\" || ' ' ||
        gsv.\"techpublications\"
      ) 
      @@ plainto_tsquery('%${payload.q.toLowerCase()}%') )
      )`;
      }

      if (payload.companyStatus && payload.companyStatus.length > 0) {
        globalSearch += ` and gsv."companyStatus" = ${payload.companyStatus}`;
      }

      if (typeof payload.companyVisibility !== 'undefined') {
        globalSearch += ` and gsv."companyVisibility" = ${payload.companyVisibility}`;
      }

      if (typeof payload.companyOnboardingStatus !== 'undefined') {
        globalSearch += ` and gsv."companyOnboardingStatus" = ${payload.companyOnboardingStatus}`;
      }

      if (payload.industries && payload.industries.length > 0) {
        payload.industries = this.parseToArray(payload.industries)
        globalSearch += ` and gsv."industry" && ARRAY[` + payload.industries + `]::int[] `;
      }

      if (payload.modalities && payload.modalities.length > 0) {
        payload.modalities = this.parseToArray(payload.modalities)
        globalSearch += ` and gsv."modality" && ARRAY[` + payload.modalities + `]::int[] `;
      }

      if (payload.fundingSource && payload.fundingSource.length > 0) {
        payload.fundingSource = this.parseToArray(payload.fundingSource)
        globalSearch += ` and gsv.\"fundingSource\" && ARRAY[` + payload.fundingSource + `]::int[] `;
      }

      if (payload.minFund >= 0) {
        globalSearch += ` and gsv."funding" ::int >= ${payload.minFund}`;
      }

      if (payload.maxFund >= 0) {
        globalSearch += ` and gsv."funding" ::int <= ${payload.maxFund}`;
      }

      if (payload.minCompanySize >= 0) {
        globalSearch += ` and gsv.\"companySize\" ::int >= ${payload.minCompanySize}`;
      }

      if (payload.maxCompanySize >= 0) {
        globalSearch += ` and gsv.\"companySize\" ::int <= ${payload.maxCompanySize}`;
      }

      globalSearch += ` ORDER BY \"id\" DESC `;
      info(`globalSearch query: ${globalSearch}`, __filename, "gloabalSearchCompanies()")

      return await this.residentCompanyRepository.query(globalSearch);
    } catch (err) {
      error("Error in search companies", __filename, "gloabalSearchCompanies()");
      throw new BiolabsException('Error in search companies', err.message);
    }
  }

  /**
  * Description: This method is used to create the new note.
  * @description This method is used to create the new note.
  * @param req object of type Request
  * @return note object
  */
  async addNote(payload: AddNotesDto, req: any): Promise<any> {
    info(`add note createdby: ${req.user.id}`, __filename, "addNote()")
    try {
      const company = await this.residentCompanyRepository.findOne(payload.companyId);
      debug(`company: ${payload.companyId}`, __filename, "addNote")
      const note = new Notes();
      note.createdBy = req.user.id;
      note.notes = payload.notes;
      note.residentCompany = company;
      return await this.notesRepository.save(await this.notesRepository.create(note));
    } catch (err) {
      error("Error in add note", __filename, "addNote()");
      throw new InternalException('Error in add note' + err.message);
    }
  }

  /**
     * Description: This method is used to get a note information.
     * @description This method is used to get a note information.
     * @param id it is a request parameter expect a number value of note id.
     */
  async getNoteById(id: number) {
    info(`get note by id: ${id}`, __filename, "getNoteById()")
    return await this.notesRepository.findOne(id);
  }
  /**
    * Description: This method is used to update notes in the application.
    * @description This method is used to update a notes in the application.
    * @param payload it is a request body contains payload of type UpdateNotesDto.
    * @param id it is a request parameter expect a number value of note id.
    * @return response
    */
  async updateNote(payload: UpdateNotesDto, id: number): Promise<any> {
    info(`updated note based notesId`, __filename, "updateNote()")
    let response = {};
    try {
      const notes = await this.getNoteById(id);
      if (notes) {
        notes.notes = payload.notes;
        await this.notesRepository.update(notes.id, notes);
        response['status'] = 'Success';
        response['message'] = 'Note Updated succesfully';
        debug("Note Updated succesfully", __filename, "updateNote()");
      } else {
        response['status'] = 'Not acceptable';
        response['message'] = 'Note with provided id not available.';
        error(`Note with provided id not available`, __filename, "updateNote()")
      }
    } catch (err) {
      response['status'] = 'Error';
      response['message'] = 'Error while  Updating  note';
      error("Error while  Updating  note", __filename, "updateNote()");
    }
    return response;
  }
  /**
   * Description: This method is used to get the note by companyId.
   * @description This method is used to get the note by companyId.
   * @param id number of note id
   * @return notes object
   */
  async getNoteByCompanyId(companyId) {
    info(`get note by companyId: ${companyId}`, __filename, "getNoteByComapnyId()")
    try {
      return await this.notesRepository
        .createQueryBuilder('notes')
        .select('notes.id', 'id')
        .addSelect("notes.createdAt", 'createdAt')
        .addSelect("notes.notes", "notes")
        .addSelect("notes.createdBy", "createdBy")
        .addSelect("usr.firstName", "firstname")
        .addSelect("usr.lastName", "lastname")
        .leftJoin('users', 'usr', 'usr.id = notes.createdBy')
        .where('notes.notesStatus = 1')
        .andWhere("notes.residentCompanyId = :residentCompanyId", { residentCompanyId: companyId })
        .orderBy("notes.createdAt", "DESC")
        .getRawMany();
    } catch (err) {
      error("Getting error in find the note", __filename, "getNoteByCompanyId()");
      throw new BiolabsException('Getting error in find the note', err.message);
    }
  }

  /**
     * Description: This method is used to soft delete the note.
     * @description This method is used to soft delete the note.
     * @param id number of note id
     * @return response
     */
  async softDeleteNote(id) {
    info(`Inside soft delete the note by id: ${id}`, __filename, "softDeleteNote()")
    let response = {};
    try {
      const note = await this.getNoteById(id);
      if (note) {
        note.notesStatus = 99;
        await this.notesRepository.save(note);
        response['status'] = 'Success';
        response['message'] = 'Note deleted succesfully';
        debug("Note deleted succesfully", __filename, "softDeleteNote()");
      }
      else {
        response['status'] = 'Not acceptable';
        response['message'] = 'Note with provided id not available.';
        error(`Note with provided id not available`, __filename, "softDeleteNote()")
      }
    } catch (err) {
      response['status'] = 'Error';
      response['message'] = 'Error in soft delete note';
      error("Error in soft delete note", __filename, "softDeleteNote()");
    }
    return response;
  }

  /**
   * Description: check for null values in object BIOL-224
   * @description check for null values in object BIOL-224
   * @param type type of list like advisors,managements,technicals
   * @param data data to be saved (for advisors,managements,technicals)
   */
  checkEmptyVal(type, data) {
    info(`Check Empty value by type: ${type}`, __filename, "checkEmptyVal()")
    if (type == 'advisors' && (data.name || data.title || data.organization)) {
      return true;
    } else if (type == 'managements' &&
      (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
        || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
      return true;
    } else if (type == 'technicals' &&
      (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
        || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
      return true;
    }
    return false;
  }

  /**
  * Description: This method is used to soft delete the list(for advisors,managements,technicals).
  * @description This method is used to soft delete the list(for advisors,managements,technicals).
  * @param id member id
  * @return object of affected rows
  */
  async softDeleteMember(id, type: string) {
    info(`Inside soft delete the Member Id ${id} type: ${type}`, __filename, "softDeleteMember()")
    let repo;
    if (type == 'advisors') {
      repo = this.residentCompanyAdvisoryRepository;
    }
    if (type == 'managements') {
      repo = this.residentCompanyManagementRepository;
    }
    if (type == 'technicals') {
      repo = this.residentCompanyTechnicalRepository;
    }
    const item = await repo.findOne({
      where: { id: id }
    });
    if (item) {
      item.status = '99';
      debug("Soft deleted succesfully", __filename, "softDeleteMember()");
      return await repo.save(item);
    } else {
      warn(`Member with provided id not available`, __filename, "softDeleteMember()")
      throw new NotAcceptableException('Member with provided id not available.');
    }
  }

  /**
   * Description: This method returns stages of technology by siteId and companyId
   * @description This method returns stages of technology by siteId and companyId
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns stages of technology
   */
  async getStagesOfTechnologyBySiteId(siteId: number, companyId: number) {
    info(`Get stages of technology by siteId: ${siteId} companyId: ${companyId}`, __filename, "getStagesOfTechnologyBySiteId()");
    const response = {};
    try {
      const queryStr = " SELECT \"stage\", \"name\", \"quarterno\", \"quat\" " +
        " FROM " +
        " (SELECT MAX(rch.\"companyStage\") AS stage, " +
        "EXTRACT(quarter FROM rch.\"createdAt\") AS \"quarterno\", " +
        "to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') AS \"quat\" " +
        "FROM public.resident_company_history AS rch " +
        "WHERE rch.\"site\" = \'{ " + siteId + "}\' and rch.\"comnpanyId\" = " + companyId +
        "GROUP BY " +
        "EXTRACT(quarter FROM rch.\"createdAt\")," +
        "to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') " +
        " ) AS csg " +
        " LEFT JOIN technology_stages AS ts ON ts.id = csg.\"stage\" " +
        " ORDER BY quat";
      info(`query: ${queryStr}`, __filename, "getStagesOfTechnologyBySiteId()")
      const compResidentHistory = await this.residentCompanyHistoryRepository.query(queryStr);
      response['stagesOfTechnology'] = (!compResidentHistory) ? 0 : compResidentHistory;
    } catch (err) {
      error("Getting error in find the stages of technology", __filename, "getStagesOfTechnologySiteId()");
      throw new BiolabsException('Getting error in find the stages of technology', err.message);
    }
    return response;
  }

  /**
   * Description: This method returns fundings by siteId and companyId
   * @description This method returns fundings by siteId and companyId
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns fundings
   */
  async getFundingBySiteIdAndCompanyId(siteId: number, companyId: number) {
    info(`get fundings by siteId: ${siteId} companyId: ${companyId}`, __filename, "getFundingBySiteIdAndCompanyId()")
    const response = {};
    try {
      const queryStr = " SELECT MAX(\"funding\" ::Decimal) as \"Funding\", " +
        " extract(quarter from rch.\"createdAt\") as \"quarterNo\", " +
        " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') AS \"quaterText\" " +
        " FROM public.resident_company_history as rch " +
        " WHERE rch.\"site\" = \'{" + siteId + "}\' and rch.\"comnpanyId\" = " + companyId +
        " group by " +
        " extract(quarter from rch.\"createdAt\"), " +
        " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') " +
        " order by to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') ";
      debug(`Fetching funds by query: ${queryStr}`, __filename, "getFundingBySiteIdAndCompanyId()");
      const fundigs = await this.residentCompanyHistoryRepository.query(queryStr);
      response['fundings'] = (!fundigs) ? 0 : fundigs;
    } catch (err) {
      error("Getting error in find the fundings", __filename, "getFundingBySiteIdAndCompanyId()");
      throw new BiolabsException('Getting error in find the fundings', err.message);
    }
    return response;
  }

  /**
   * Description: This method returns started with biolabs date.
   * @description This method returns started with biolabs date.
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns started with biolabs date
   */
  async getstartedWithBiolabs(siteId: number, companyId: number) {
    info(`get started with Biolabs by siteId: ${siteId} companyId: ${companyId}`, __filename, "getstartedWithBiolabs()")
    try {
      const queryStr = "SELECT min(\"createdAt\")  as startWithBiolabs FROM public.resident_company_history" +
        " WHERE \"site\" = \'{" + siteId + "}\' and \"comnpanyId\" = " + companyId +
        "AND \"companyOnboardingStatus\" = true";
      debug(`get started with biolabs history by query: ${queryStr}`, __filename, "getstartedWithBiolabs()")
      const startWithBiolab = await this.residentCompanyHistoryRepository.query(queryStr);
      return startWithBiolab;
    } catch (err) {
      error("Getting error in find the history of started with Biolabs analysis", __filename, "getstartedWithBiolabs()");
      throw new BiolabsException('Getting error in find the history of started with Biolabs analysis', err.message);
    }
  }
  /**
   * Description: This method returns current month fee details
   * @description This method returns current month fee details
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns current month fee details
   */
  async getFinancialFees(companyId: number) {
    info(`get financial fees by companyId: ${companyId}`, __filename, "getFinancialFees()")
    try {
      const currentMonth = new Date().getMonth() + 1;
      const queryStr = "SELECT  p. \"productTypeId\",SUM(calculate_prorating(o.\"cost\",o.\"month\",o.\"startDate\",o.\"endDate\",o.\"quantity\",o.\"currentCharge\",o.\"year\"))  From order_product as o " +
        "INNER JOIN product as p ON  p.id =o.\"productId\" " +
        "where p.id = o.\"productId\" " +
        "AND o.\"companyId\"=" + companyId +
        "AND o.\"month\" =  " + currentMonth +
        "AND p.\"productTypeId\" IN(1, 2, 5) " +
        "group by  p.\"productTypeId\" ";
      info(`getting financial fees by query: ${queryStr}`, __filename, "getFinancialFees()")
      return await this.residentCompanyHistoryRepository.query(queryStr);
    } catch (err) {
      error("Getting error in find the financial fees", __filename, "getFinancialFees()");
      throw new BiolabsException('Getting error in find the financial fees', err.message);
    }
  }

  /**
   * Description: This method returns changes as feeds
   * @description This method returns changes as feeds
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns latest feeds
   */
  async getFeeds(siteId: number, companyId: number) {
    info(`get feeds by siteId: ${siteId} companyId: ${companyId}`, __filename, "getFeeds()")
    try {
      const getFeeds = await this.residentCompanyHistoryRepository.query("SELECT * FROM feeds(" + companyId + ")").catch(err => {
        switch (err.code) {
          case '42883':
            debug(err.message, __filename, "getFeeds()")
            throw new BiolabsException("Error in executing feeds function with companyId :  ", companyId, err.message);
            break;
        }
      });
      return getFeeds;
    } catch (err) {
      error("Getting error to find the time analysis", err.message, __filename, "getFeeds()");
      throw new BiolabsException('Getting error in updating feeds', err.message);
    }
  }

  /**
   * Description: This method returns data to visualize timeline data on graph.
   * @description This method returns data to visualize timeline data on graph.
   * @param companyId The Company id.
   * @returns timeline data.
   */

  async timelineAnalysis(companyId: number) {
    info(`Timeline analysis by companyId : ${companyId}`, __filename, `timelineAnalysis()`);
    // const queryStr = `
    // SELECT "productTypeId",  MAX("total")as sumofquantity ,
    //         extract(quarter from "updatedAt")as quarterNo,
    //         to_char("updatedAt", '"Q"Q.YYYY') AS quat
    // FROM
    //    (SELECT  p."productTypeId",SUM(o.quantity) as total, o."updatedAt",
    //       extract(quarter from o."updatedAt") as quarterNo,
    //       to_char(o."updatedAt", '"Q"Q.YYYY') AS quat
    //    FROM order_product as o
    // INNER JOIN product as p ON p.id = o."productId"
    //         where p.id = o."productId" 
    //             AND "companyId"=${companyId}
    //             AND p."productTypeId" IN (2,4)
    // group by p."productTypeId" ,o."updatedAt",
    //       extract(quarter from o."updatedAt"),
    //       to_char(o."updatedAt", '"Q"Q.YYYY')
    //     order by to_char(o."updatedAt", '"Q"Q.YYYY')) as sunTbl
    // GROUP BY extract(quarter from sunTbl."updatedAt"),
    //             sunTbl."productTypeId",to_char("updatedAt", '"Q"Q.YYYY')
    //             order by quat;
    // `;
    const queryStr = `
    SELECT
      "productTypeId",
      MAX("total") as sumofquantity,
      -- month, year,
      -- TO_DATE(year ::text || '-' || month ::text || '-' || '01','YYYY-MM-DD'),
      extract(quarter from TO_DATE(year :: text || '-' || month :: text || '-' || '01', 'YYYY-MM-DD')) as quarterNo,
      to_char(TO_DATE(year :: text || '-' || month :: text || '-' || '01', 'YYYY-MM-DD'), '"Q"Q.YYYY') AS quat
    FROM
      (SELECT
          p."productTypeId", SUM(o.quantity) as total,
          o.month,o.year
        fROM
          order_product as o
          INNER JOIN product as p ON p.id = o."productId"
        where
          p.id = o."productId"
          AND "companyId" =${companyId}
          AND p."productTypeId" IN (2, 4)
        group by
          p."productTypeId",o.month, o.year
      ) as sub1
    GROUP BY
  sub1."productTypeId",
  --  sub1.month,sub1.year,
   extract(quarter from TO_DATE(year :: text || '-' || month :: text || '-' || '01', 'YYYY-MM-DD')),
   to_char(TO_DATE(year :: text || '-' || month :: text || '-' || '01', 'YYYY-MM-DD'), '"Q"Q.YYYY')
order by quat;
    `;
    return await this.residentCompanyHistoryRepository.query(queryStr);
  }
  /**
 * Description: This method returns companySize Quarterly.
 * @description This method returns current month fee details.
 * @param companyId The Company id
 * @returns current month fee details.
 */

  async getCompanySizeQuartly(companyId: number) {
    info(`Get Company size quarterly by companyId : ${companyId}`, __filename, `getCompanySizeQuartly()`);
    try {
      const queryStr = `
    SELECT 
       MAX("companySize") as noOfEmployees,
          extract(quarter from "updatedAt")as quarterNo,
          to_char("updatedAt", '"Q"Q.YYYY') AS quat
  FROM resident_company_history 
         where "comnpanyId"=${companyId}
  group by
            extract(quarter from "updatedAt"),
            to_char("updatedAt", '"Q"Q.YYYY')
            order by quat;
    `;

      debug(`getting companySize Quarterly: ${queryStr}`, __filename, "getCompanySizeQuartly()")
      return await this.residentCompanyHistoryRepository.query(queryStr);
    } catch (err) {
      error("Getting error in find theget company size quartly", __filename, "getCompanySizeQuartly()");
      throw new BiolabsException('Getting error in find company size quartly', err.message);
    }
  }

  /**
   * @description Create waitlist entry while saving Resident Company
   * @param savedRc
   * @param req
   */
  public async addResidentCompanyDataInWaitlist(savedRc: any) {

    info(`Create waitlist on application submission`, __filename, "addResidentCompanyDataInWaitlist()");
    const PLAN_CHANGE_SUMMARY_INITIAL_VALUE = 'See Notes';
    const moveIn = await this.getMoveInPrefrence().find(pr => pr.id == savedRc.preferredMoveIn);
    const REQUEST_NOTES_INITIAL_VALUE = moveIn.name + ', Equipment and facilities you plan to primarily use onsite : ' + savedRc.equipmentOnsite;
    const REQUEST_TYPE_EXTERNAL = false;
    const maxPriorityOrder: number = await this.fetchMaxPriorityOrderOfWaitlist().then((result) => {
      return result;
    }).catch(err => {
      error("Getting error while fetching  maxPriorityOrder", __filename, "addResidentCompanyDataInWaitlist()");
      throw new BiolabsException('Getting error while fetching  maxPriorityOrder ', err.message);
    });
    debug(`Max priority order: ${maxPriorityOrder}`, __filename, "addResidentCompanyDataInWaitlist()");

    /** Fetch product types from DB to set in waitlist as desiredQty = 0 and currentQty = 0 */
    let productTypes: any = await this.getProductTypesInitially().then((result) => {
      return result;
    });

    let spaceChangeWaitlistObj = new SpaceChangeWaitlist();
    spaceChangeWaitlistObj.residentCompany = savedRc;
    spaceChangeWaitlistObj.desiredStartDate = Date.parse(new Date().toString()) / 1000;
    spaceChangeWaitlistObj.planChangeSummary = PLAN_CHANGE_SUMMARY_INITIAL_VALUE;
    spaceChangeWaitlistObj.requestedBy = savedRc.name;
    spaceChangeWaitlistObj.requestStatus = RequestStatusEnum.Open;
    spaceChangeWaitlistObj.fulfilledOn = null;
    spaceChangeWaitlistObj.isRequestInternal = REQUEST_TYPE_EXTERNAL;
    spaceChangeWaitlistObj.requestNotes = REQUEST_NOTES_INITIAL_VALUE;
    spaceChangeWaitlistObj.internalNotes = null;
    spaceChangeWaitlistObj.siteNotes = null;
    spaceChangeWaitlistObj.priorityOrder = maxPriorityOrder;
    spaceChangeWaitlistObj.site = savedRc.site;
    spaceChangeWaitlistObj.membershipChange = MembershipChangeEnum.UpdateMembership;
    spaceChangeWaitlistObj.requestGraduateDate = null;
    spaceChangeWaitlistObj.marketPlace = null;
    const respSaved = await this.spaceChangeWaitlistRepository.save(spaceChangeWaitlistObj).then((result) => {
      return result;
    }).catch(err => {
      error("Getting error while Saving Waitlist", __filename, "addResidentCompanyDataInWaitlist()");
      throw new BiolabsException('Getting error while Saving Waitlist ', err.message);
    });
    /** Save items for the waitlist */
    if (productTypes && respSaved) {
      this.saveItemsForWaitlist(productTypes, respSaved);
    }
    return respSaved;
  }

  /**
   * Description: Fetch product types from DB to set in waitlist as desiredQty = 0 and currentQty = 0.
   * @description Fetch product types from DB to set in waitlist as desiredQty = 0 and currentQty = 0.
   * @returns list of product types
   */
  private async getProductTypesInitially() {
    info(`Fetching produt types from db`, __filename, `getProductTypesInitially()`);
    let productTypes: any = await this.productTypeService.getProductType().then((result) => {
      return result;
    }).catch(err => {
      error(`Error while fetching product types`, __filename, `getProductTypesInitially()`);
      throw new BiolabsException('Error while fetching product types', err.message);
    });
    debug(`Fetched produt types from db, total:  ${productTypes.length}`, __filename, `getProductTypesInitially()`);
    return productTypes;
  }

  /**
   * Description: Save product types in items table for waitlist as desiredQty = 0 and currentQty = 0.
   * @description Save product types in items table for waitlist as desiredQty = 0 and currentQty = 0.
   * @param productTypes array of product types
   * @param savedWaitlist Saved waitlist object
   */
  private async saveItemsForWaitlist(productTypes: any[], savedWaitlist: any) {
    info(`Saving produt types in items table, total product types: ${productTypes.length}`, __filename, `saveItemsForWaitlist()`);
    for (let index = 0; index < productTypes.length; index++) {
      let productTypeNameTemp = productTypes[index].productTypeName != undefined && productTypes[index].productTypeName != null && productTypes[index].productTypeName != '' ? productTypes[index].productTypeName.trim() : productTypes[index].productTypeName;

      /** Skip some specifice products to be saved in change request */
      if (!(ApplicationConstants.SKIP_PRODUCT_TYPE_IDS.includes(productTypes[index].id) || ApplicationConstants.SKIP_PRODUCT_TYPE_NAMES.includes(productTypeNameTemp))) {
        let item: Item = new Item();
        item.productTypeId = productTypes[index].id;
        item.itemName = productTypes[index].productTypeName;
        item.currentQty = 0;
        item.desiredQty = 0;
        item.spaceChangeWaitlist = savedWaitlist;
        item.spaceChangeWaitlist_id = savedWaitlist.id;
        await this.itemRepository.save(this.itemRepository.create(item)).catch(err => {
          error(`Error while saving items`, __filename, `saveItemsForWaitlist()`);
          throw new BiolabsException('Error while saving items in Waitlist ', err.message);
        });
      }
    }
  }

  /**
   * @description Fetch max value of priority order from space_change_waitlist table
   * @returns
   */
  public async fetchMaxPriorityOrderOfWaitlist(): Promise<number> {
    info(`Fetching max priority order of Space Change Waitlist`, __filename, 'fetchMaxPriorityOrderOfWaitlist()');
    const REQUEST_STATUS_OPEN = 0;
    let maxPriorityOrder: any = await this.spaceChangeWaitlistRepository
      .createQueryBuilder(`space_change_waitlist`)
      .select(`MAX(space_change_waitlist.priorityOrder)`, `max`)
      .where('space_change_waitlist.requestStatus = :requestStatus')
      .setParameter('requestStatus', REQUEST_STATUS_OPEN)
      .getRawOne();
    if (maxPriorityOrder && (maxPriorityOrder.max != null || maxPriorityOrder.max == 0)) {
      return maxPriorityOrder.max + 1;
    } else {
      return 0;
    }
  }

  /**
   * @description BIOL-275: Add an entry of space change wait list
   * @param payload
   * @param req
   * @returns
   */
  public async addToSpaceChangeWaitList(payload: AddSpaceChangeWaitlistDto, siteIdArr: any, @Request() req): Promise<any> {
    info(`Add Space Change Waitlist for companyId : ${payload.residentCompanyId} and site: ${req.user.site_id}`, __filename, "addToSpaceChangeWaitList()");
    const COULD_NOT_SAVE_SPACE_CHANGE_WAITLIST_ERR_MSG = "Could not save Space Change Waitlist record";
    const COULD_NOT_UPDATE_RESIDENT_COMPANY_ERR_MSG = "Could not update Resident Company record";
    const COULD_NOT_UPDATE_RESIDENT_COMPANY_HISTORY_ERR_MSG = "Could not update Resident Company History record";
    const ERROR_IN_FETCHING_MAX_PRIORITY_ORDER_ERR_MSG = "Error while fetching Max Priority Order to set in new Space Change Waitlist record";
    // const COULD_NOT_SEND_EMAIL_NOTIFICATION_ERR_MSG = "Could not send email notification";
    let shareYourProfileTemp;

    let residentCompany: any = await this.fetchResidentCompanyById(payload.residentCompanyId).then((result) => {
      return result;
    });
    let response = {};
    if (residentCompany == null) {
      response['status'] = 'Error';
      response['message'] = 'Resident Company not found by id: ' + payload.residentCompanyId;
      response['body'] = {}
      error(`Resident Company not found by id: ${payload.residentCompanyId}`, __filename, `addToSpaceChangeWaitList()`);
      return response;
    }
    info(`Fetched Resident Company from DB, Company name: : ${residentCompany.companyName} `, __filename, `addToSpaceChangeWaitList()`);
    shareYourProfileTemp = residentCompany.shareYourProfile;

    let maxPriorityOrder: number;
    if (payload.requestStatus == 0) {
      info(`Fetching max priority order for Space Change Waitlist for status : ${payload.requestStatus} `, __filename, `addToSpaceChangeWaitList()`);

      maxPriorityOrder = await this.fetchMaxPriorityOrderOfWaitlist().then((result) => {
        return result;

      }).catch(err => {
        error(`Error in fetching max priority order. ${err.message}`, __filename, `addToSpaceChangeWaitList()`);
        throw new HttpException({
          status: "Error",
          message: ERROR_IN_FETCHING_MAX_PRIORITY_ORDER_ERR_MSG,
          body: err
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
    } else {
      maxPriorityOrder = ApplicationConstants.APPROVED_DENIED_WAITLIST_PRIORITY_ORDER;
    }
    info(`Max priority order for Space Change Waitlist : ${maxPriorityOrder} `, __filename, `addToSpaceChangeWaitList()`);

    let spaceChangeWaitlistObj = new SpaceChangeWaitlist();
    spaceChangeWaitlistObj.residentCompany = residentCompany;
    spaceChangeWaitlistObj.graduateDescription = payload.graduateDescription;
    spaceChangeWaitlistObj.desiredStartDate = payload.desiredStartDate;
    spaceChangeWaitlistObj.planChangeSummary = payload.planChangeSummary;
    spaceChangeWaitlistObj.requestedBy = residentCompany.name;
    spaceChangeWaitlistObj.requestStatus = payload.requestStatus;
    spaceChangeWaitlistObj.fulfilledOn = payload.fulfilledOn;
    spaceChangeWaitlistObj.isRequestInternal = payload.isRequestInternal;
    spaceChangeWaitlistObj.requestNotes = payload.requestNotes;
    spaceChangeWaitlistObj.internalNotes = payload.internalNotes;
    spaceChangeWaitlistObj.siteNotes = payload.siteNotes;
    spaceChangeWaitlistObj.priorityOrder = maxPriorityOrder;
    //let siteIdArr = siteIdArr;
    // if (req.headers['x-site-id']) {
    //   siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    // }
    spaceChangeWaitlistObj.site = siteIdArr;
    spaceChangeWaitlistObj.createdBy = req.user.id;
    spaceChangeWaitlistObj.modifiedBy = req.user.id;
    spaceChangeWaitlistObj.membershipChange = payload.membershipChange;
    spaceChangeWaitlistObj.requestGraduateDate = payload.requestGraduateDate;
    spaceChangeWaitlistObj.marketPlace = payload.marketPlace;

    const resp = await this.spaceChangeWaitlistRepository.save(this.spaceChangeWaitlistRepository.create(spaceChangeWaitlistObj))
      .catch(err => {
        error(`Error in saving Space Change Waitlist. ${err.message} `, __filename, `addToSpaceChangeWaitList()`);
        throw new HttpException({
          status: 'Error',
          message: COULD_NOT_SAVE_SPACE_CHANGE_WAITLIST_ERR_MSG,
          body: err
        }, HttpStatus.BAD_REQUEST);
      });

    if (resp == null) {
      response['status'] = 'Error';
      response['message'] = COULD_NOT_SAVE_SPACE_CHANGE_WAITLIST_ERR_MSG;
      response['message'] = {};
      return response;
    }
    info(`Space Change Waitlist saved, id: ${resp.id}`, __filename, `addToSpaceChangeWaitList()`);
    for (let itemDto of payload.items) {
      let itemObj: Item = new Item();

      itemObj.productTypeId = itemDto.productTypeId;
      itemObj.itemName = itemDto.itemName;
      itemObj.currentQty = itemDto.currentQty;
      itemObj.desiredQty = itemDto.desiredQty;
      itemObj.spaceChangeWaitlist = resp;
      await this.itemRepository.save(this.itemRepository.create(itemObj));
    }

    /** Update Resident Company details */
    residentCompany.companyStage = payload.companyStage;
    residentCompany.funding = payload.funding;
    residentCompany.fundingSource = payload.fundingSource;
    residentCompany.companySize = payload.companySize;
    residentCompany.shareYourProfile = payload.shareYourProfile;
    await this.residentCompanyRepository.update(residentCompany.id, residentCompany)
      .then(() => {
        info(`Resident Company details updated with id: ${residentCompany.id}`, __filename, `addToSpaceChangeWaitList()`);
      }).catch(err => {
        error(`Error in updating Resident Company details with id: ${residentCompany.id}`, __filename, `addToSpaceChangeWaitList()`);
        throw new HttpException({
          status: "Error",
          message: COULD_NOT_UPDATE_RESIDENT_COMPANY_ERR_MSG,
          body: err
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      });

    /** Update Resident Company history */
    await this.updateCompanyHistoryAfterSavingSpaceChangeWaitlist(payload, residentCompany).catch(err => {
      error(`Error in updating Resident Company history with id: ${residentCompany.id}`, __filename, `addToSpaceChangeWaitList()`);
      throw new HttpException({
        status: "Error",
        message: COULD_NOT_UPDATE_RESIDENT_COMPANY_HISTORY_ERR_MSG,
        body: err
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    /** Send email notification to Site Admin to notify about new Plan Change Request submission */
    this.sendEmailToSiteAdmin(req.user.site_id, req, residentCompany.companyName, residentCompany.id, ApplicationConstants.EMAIL_FOR_SPACE_CHANGE_REQUEST_SUBMITTED).catch(() => {
      error(`Error in sending email notification to site admin for SPACE_CHANGE_WAITLIST with id: ${resp.id}`, __filename, `addToSpaceChangeWaitList()`);
    });

    /** BIOL-308: Notify Site Admin if the sponsorship question changes to Yes. shareYourProfile = true */
    if (!shareYourProfileTemp && payload.shareYourProfile) {
      debug(`Sponsor ship contact question changed to: ${payload.shareYourProfile}`, __filename, `addToSpaceChangeWaitList()`);
      await this.sendEmailToSiteAdmin(siteIdArr, req, residentCompany.companyName, residentCompany.id, ApplicationConstants.EMAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES).catch(() => {
        error(`Error in sending email notification to site admin for sponsorship question changes to Yes`, __filename, `addToSpaceChangeWaitList()`);
      });
      info(`Email sent regarding Sponsorship contact question change to Yes`, __filename, `addToSpaceChangeWaitList()`);
    }

    info(`Space Change waitlist saved successfully`, __filename, `addToSpaceChangeWaitList()`);
    response['status'] = 'Success';
    response['message'] = 'Operation Successful';
    return response;
  }

  /**
   * Description: Update Resident Company History after saving record in space_change_waitlist table.
   * @description Update Resident Company History after saving record in space_change_waitlist table.
   * @param payload ResidentCompany history data
   * @param residentCompany ResidentCompany object
   */
  public async updateCompanyHistoryAfterSavingSpaceChangeWaitlist(payload: any, residentCompany: ResidentCompany) {
    info(`Updating resident company history by companyId: ${residentCompany.id}`, __filename, `updateCompanyHistoryAfterSavingSpaceChangeWaitlist()`);
    let historyData: any = JSON.parse(JSON.stringify(residentCompany));
    historyData.companyStage = payload.companyStage;
    historyData.funding = payload.funding;
    historyData.fundingSource = payload.fundingSource;
    historyData.companySize = payload.companySize;
    historyData.comnpanyId = residentCompany.id;
    delete historyData.id;
    await this.residentCompanyHistoryRepository.save(historyData);
    info(`Executed resident company history update flow by companyId: ${residentCompany.id}`, __filename, `updateCompanyHistoryAfterSavingSpaceChangeWaitlist()`);
  }

  /**
   * @description BIOL-275: fetch a resident company by id from db
   * @param residentCompanyId 
   * @returns 
   */
  private async fetchResidentCompanyById(residentCompanyId: number) {
    info(`Fetching resident company id: ${residentCompanyId}`, __filename, `fetchResidentCompanyById()`);
    return await this.residentCompanyRepository.findOne(residentCompanyId);
  }

  /**
   * Description: BIOL-275 GET spacechange waitlist by status, siteId and companyId.
   * @description GET spacechange waitlist by status, siteId and companyId.
   * @param statusArr array of status (0,1,2)
   * @param siteIdArr array of siteId
   * @param companyId id if the company
   * @returns list of Space Change Waitlist
   */
  public async getSpaceChangeWaitListByStatusSiteIdAndCompanyId(statusArr: number[], siteIdArr: number[], companyId: number, @Request() req): Promise<any> {
    info(`Get Space Change Waitlist by status: ${statusArr}, siteId: ${siteIdArr} and companyId: ${companyId}`, __filename, `getSpaceChangeWaitListByStatusSiteIdAndCompanyId()`);
    let response = {};
    let status: number[] = [];
    try {
      for (let index = 0; index < statusArr.length; index++) {
        status.push(Number(statusArr[index]));
      }

      let waitlistQuery = await this.spaceChangeWaitlistRepository.createQueryBuilder("space_change_waitlist")
        .select("space_change_waitlist.*")
        .addSelect("rc.companyName", "residentCompanyName")
        .addSelect("u.firstName", "firstName")
        .addSelect("u.lastName", "lastName")
        .leftJoin('resident_companies', 'rc', 'rc.id = space_change_waitlist.residentCompanyId')
        .leftJoin('users', 'u', 'u.id = space_change_waitlist.modifiedBy')
        .andWhere("space_change_waitlist.requestStatus IN (:...status)", { status: status });

      if (siteIdArr && siteIdArr.length) {
        waitlistQuery.andWhere("space_change_waitlist.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
      }
      if (companyId && companyId != undefined && companyId > 0) {
        waitlistQuery.andWhere("space_change_waitlist.residentCompanyId = :residentCompanyId", { residentCompanyId: companyId });
      }
      waitlistQuery.orderBy("space_change_waitlist.priorityOrder", "ASC");
      let spaceChangeWaitlist: any = await waitlistQuery.getRawMany();
      response = this.getItemsOfSpaceChangeWaitlist(spaceChangeWaitlist, req);
      response['spaceChangeWaitlist'] = (!spaceChangeWaitlist) ? 0 : spaceChangeWaitlist;
    } catch (error) {
      response['status'] = 'Error';
      response['message'] = 'Problem in fetching Space Change Waitlist';
      response['body'] = error;
      error(`Error in fetching Space Change Waitlist. Message: ${error.message}`, __filename, `getSpaceChangeWaitListByStatusSiteIdAndCompanyId()`);
      return response;
    }
    info(`Executed Get Space Change Waitlist by status, siteId and companyId`, __filename, `getSpaceChangeWaitListByStatusSiteIdAndCompanyId()`);
    return response;
  }

  /**
   * Description: Iterates SpaceChangeWaitlist array, fetches items for each iteration and addes to the array.
   * @description Iterates SpaceChangeWaitlist array, fetches items for each iteration and addes to the array.
   * @param spaceChangeWaitlist SpaceChangeWaitlist array
   * @param req Request object
   * @returns SpaceChangeWaitlist array with Item array
   */
  public async getItemsOfSpaceChangeWaitlist(spaceChangeWaitlist: any[], @Request() req) {
    info(`Getting items of Space Change Waitlist`, __filename, `getItemsOfSpaceChangeWaitlist()`);
    if (spaceChangeWaitlist) {
      for (let index = 0; index < spaceChangeWaitlist.length; index++) {
        const itemsWithUpdatedInvoice: any = await this.getSpaceChangeWaitlistItems(spaceChangeWaitlist[index].residentCompanyId, req);
        const fetchedItemsArr = await this.getItems(spaceChangeWaitlist[index].id, itemsWithUpdatedInvoice.items).then((result) => {
          return result;
        }).catch(err => {
          error(`Error in getting items of Space Change Waitlist`, __filename, `getItemsOfSpaceChangeWaitlist()`);
          throw new HttpException({
            status: "Error",
            message: "Problem in fetching Items for Space Change Waitlist",
            body: err
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        spaceChangeWaitlist[index].items = fetchedItemsArr;
      }
    }
    return spaceChangeWaitlist;
  }

  /**
   * Description: Fetch Item array by SpaceChangeWaitlist id.
   * @description Fetch Item array by SpaceChangeWaitlist id.
   * @param spaceChangeWaitlistId SpaceChangeWaitlist Id
   * @returns array of Item
   */
  public async getItems(spaceChangeWaitlistId: number, itemsWithUpdatedInvoices: any[]) {
    info(`Getting items by spaceChangeWaitlistId: ${spaceChangeWaitlistId}`, __filename, `getItems()`);

    const waitlistItems: any[] = await this.itemRepository.find({
      where: { spaceChangeWaitlist_id: spaceChangeWaitlistId }
    });
    for (let index = 0; index < waitlistItems.length; index++) {
      let result: any = itemsWithUpdatedInvoices.filter(cItem => (cItem.productTypeId == waitlistItems[index].productTypeId));

      if (result && result.length > 0) {
        waitlistItems[index].currentQty = Number(result[0].sum);
      }
    }
    info(`Executed getItems() method`, __filename, `getItems()`);
    return waitlistItems;
  }

  /**
   * @description BIOL-275: GET spacechange waitlist by id
   * @param statusArr
   * @returns
   */
  public async getSpaceChangeWaitListById(id: number): Promise<any> {
    info(`Getting Space Change Waitlist by id: ${id}`, __filename, `getSpaceChangeWaitListById()`);
    const response = {};

    let spaceChangeWaitlistObj: any = await this.spaceChangeWaitlistRepository.findOne(id, { relations: ['items'] });
    if (spaceChangeWaitlistObj) {
      return spaceChangeWaitlistObj;
    }
    response['status'] = 'error';
    response['message'] = 'Space Change Waitlist not found by id: ' + id;
    error(`Space Change Waitlist not found by id: ${id}`, __filename, `getSpaceChangeWaitListById()`);
    return response;
  }

  /**
   * Description: Check if the user has permission to access the company, if not then throw NotAcceptableException.
   * @description Check if the user has permission to access the company, if not then throw NotAcceptableException.
   * @param req Request object
   * @param residentCompanyId Resident Company id
   */
  public async CheckCompanyPermissionForUser(@Request() req, residentCompanyId: number) {
    info(`Checking permission to access the resident company id: ${residentCompanyId}`, __filename, "CheckCompanyPermissionForUser()");

    if (req && req.user && req.user.companyId && req.user.companyId != residentCompanyId) {
      // Checking if companyVisibility is true then allow to view those
      const residentCompanyVisiblityTrue: any = await this.residentCompanyRepository.findOne({
        where: { id: residentCompanyId, companyVisibility: true }
      });
      if (residentCompanyVisiblityTrue) {
        return false;
      }
      error(`User does not have permission to view the company: ${residentCompanyId}`, __filename, "CheckCompanyPermissionForUser()");
      throw new NotAcceptableException(
        'You do not have permission to view this company',
      );
    }
  }

  /**
   * Descrition: Get site id array from request object
   * @description Get site id array from request object.
   * @param req Request object
   * @returns 
   */
  public getSiteIdArrFromRequestObject(@Request() req): number[] {
    info(`Get site id array from request object`, __filename, "getSiteIdArrFromRequestObject()");
    let siteIdArr: number[];
    if (req && req.user && req.headers) {
      info(`Fetching site Id array from request header`, __filename, "getSiteIdArrFromRequestObject()");
      siteIdArr = req.user.site_id;
      if (req.headers['x-site-id']) {
        siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
      }
      info(`Site Id fetched from request header: ${siteIdArr}`, __filename, "getSiteIdArrFromRequestObject()");
    }
    return siteIdArr;
  }

  /**
   * @description Get items for waitlist
   * @param companyId id of Company
   * @returns list of items
   */
  public async getSpaceChangeWaitlistItems(companyId: number, @Request() req) {
    info(`Get Space Change Waitlist items by company id: ${companyId}`, __filename, `getSpaceChangeWaitlistItems()`);
    const response = {};
    let siteIdArr;

    /** Check if user has permission to view this company */
    this.CheckCompanyPermissionForUser(req, companyId);
    siteIdArr = this.getSiteIdArrFromRequestObject(req);

    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: companyId }
    });

    if (residentCompany) {
      info(`Fetched resident company from repository, id : ${residentCompany.id}`, __filename, "getSpaceChangeWaitlistItems()");
      /** Check if sites are accessible to the user */
      this.checkIfValidSiteIds(siteIdArr, residentCompany.site);
    }

    const month = new Date().getMonth() + 2; // Getting next month from currect date
    const queryStr = `
    select res."productTypeId", sum(res.count), res."productTypeName"
    from (
        select pt.id as "productTypeId",
        CASE WHEN (op."quantity") is null THEN 0 ELSE (op."quantity") END as quantity,
        CASE WHEN (COUNT(op."productTypeId") * op."quantity") is null THEN 0 ELSE (COUNT(op."productTypeId") * op."quantity") END as count,
        pt."productTypeName"
        from product_type as pt
        Left Join (select "productTypeId", quantity from order_product where "companyId" = ${companyId} and month = ${month} ) as op
        on pt.id = op."productTypeId"
        where pt."productTypeName" <> 'Decontamination Fee'
        and pt."productTypeName" <> 'Retainer Fee'
        group by op."quantity", op."productTypeId", pt."productTypeName", pt.id
        ) as res
    group by res."productTypeId", res."productTypeName"
    `;

    const items = await this.residentCompanyHistoryRepository.query(queryStr);
    response['items'] = (!items) ? 0 : items;
    info(`Executed getSpaceChangeWaitlistItems`, __filename, `getSpaceChangeWaitlistItems()`);
    return response;
  }

  /**
   * Description: Updates the priority order of Open space change wait list.
   * @description Updates the priority order of Open space change wait list.
   * @param payload UpdateWaitlistPriorityOrderDto
   * @returns response with status and message fields
   */
  public async updateSpaceChangeWaitlistPriorityOrder(payload: UpdateWaitlistPriorityOrderDto) {
    info(`Updating priority order of Space Change Waitlist by ids: ${payload.spaceChangeWaitlistIds}`, __filename, `updateSpaceChangeWaitlistPriorityOrder()`);
    let response = {};
    try {
      if (payload && payload.spaceChangeWaitlistIds.length > 0) {
        for (let index = 0; index < payload.spaceChangeWaitlistIds.length; index++) {
          let obj = await this.spaceChangeWaitlistRepository.findOne(payload.spaceChangeWaitlistIds[index]);
          obj.priorityOrder = index;
          await this.spaceChangeWaitlistRepository.update(payload.spaceChangeWaitlistIds[index], obj);
        }
        response['status'] = 'Success';
        response['message'] = 'Priority Order updated successfully';
        info(`Space Change Waitlist priority order updated`, __filename, `updateSpaceChangeWaitlistPriorityOrder()`);
      } else {
        response['status'] = 'Not acceptable';
        response['message'] = 'Please provide proper Space Change Waitlist ids';
        info(`Need ids to update Space Change Waitlist priority order`, __filename, `updateSpaceChangeWaitlistPriorityOrder()`);
      }
    } catch (e) {
      response['status'] = 'Fail';
      response['message'] = 'Could not update Priority Order';
      error(`Could not update priority order`, __filename, `updateSpaceChangeWaitlistPriorityOrder()`);
    }
    return response;
  }

  /**
   * Description: Update Space Change Waitlist with items, update Resident Company details, update Resident Company history.
   * @description Update Space Change Waitlist with items, update Resident Company details, update Resident Company history.
   * @param payload The payload of Space Change Waitlist to with updated entries.
   * @param siteIdArr The array of site ids.
   * @param req The Request object.
   * @returns 
   */
  public async updateSpaceChangeWaitlist(payload: UpdateSpaceChangeWaitlistDto, siteIdArr: any, @Request() req) {
    info(`Updating Space Change Waitlist record`, __filename, `updateSpaceChangeWaitlist()`);
    const COULD_NOT_UPDATE_RESIDENT_COMPANY_ERR_MSG = "Could not update Resident Company record";
    const COULD_NOT_UPDATE_RESIDENT_COMPANY_HISTORY_ERR_MSG = "Could not update Resident Company History record";
    let response = {};
    let shareYourProfileTemp;
    try {
      if (payload) {
        debug(`Space Change Waitlist Id: ${payload.spaceChangeWaitlistId}`, __filename, `updateSpaceChangeWaitlist()`);
        let spaceChangeWaitlistObj: any = await this.spaceChangeWaitlistRepository.findOne(payload.spaceChangeWaitlistId).catch(err => {
          error(`Error in fetching Space Change Waitlist by id: ${payload.spaceChangeWaitlistId}`, __filename, `updateSpaceChangeWaitlist()`);
          throw new HttpException({
            status: "Error",
            message: "Error in fetching Space Change Waitlist by id " + payload.spaceChangeWaitlistId,
            body: err
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
        if (spaceChangeWaitlistObj) {
          spaceChangeWaitlistObj.desiredStartDate = payload.desiredStartDate;
          spaceChangeWaitlistObj.planChangeSummary = payload.planChangeSummary;
          spaceChangeWaitlistObj.graduateDescription = payload.graduateDescription;
          spaceChangeWaitlistObj.requestStatus = payload.requestStatus;
          spaceChangeWaitlistObj.fulfilledOn = payload.fulfilledOn;
          spaceChangeWaitlistObj.isRequestInternal = payload.isRequestInternal;
          spaceChangeWaitlistObj.requestNotes = payload.requestNotes;
          spaceChangeWaitlistObj.internalNotes = payload.internalNotes;
          spaceChangeWaitlistObj.siteNotes = payload.siteNotes;
          spaceChangeWaitlistObj.membershipChange = payload.membershipChange;
          spaceChangeWaitlistObj.requestGraduateDate = payload.requestGraduateDate;
          spaceChangeWaitlistObj.marketPlace = payload.marketPlace;
          spaceChangeWaitlistObj.marketPlace = payload.marketPlace;
          spaceChangeWaitlistObj.modifiedBy = req.user.id;

          await this.spaceChangeWaitlistRepository.update(payload.spaceChangeWaitlistId, spaceChangeWaitlistObj)
            .catch(err => {
              error(`Error in updating Space Change Waitlist by id: ${payload.spaceChangeWaitlistId}`, __filename, `updateSpaceChangeWaitlist()`);
              throw new HttpException({
                status: "Error",
                message: "Error in updating Space Change Waitlist by id " + payload.spaceChangeWaitlistId,
                body: err
              }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

          /** Update Space Change Waitlist items */
          await this.updateSpaceChangeWaitlistItems(payload, spaceChangeWaitlistObj).catch(err => {
            error(`Error in updating Space Change Waitlist items `, __filename, `updateSpaceChangeWaitlist()`);
            throw new HttpException({
              status: "Error",
              message: "Error in updating Space Change Waitlist items",
              body: err
            }, HttpStatus.INTERNAL_SERVER_ERROR);
          });

          /** Update Resident Company details */
          shareYourProfileTemp = spaceChangeWaitlistObj.residentCompany.shareYourProfile;
          let residentCompany: any = spaceChangeWaitlistObj.residentCompany;
          residentCompany.companyStage = payload.companyStage;
          residentCompany.funding = payload.funding;
          residentCompany.fundingSource = payload.fundingSource;
          residentCompany.companySize = payload.companySize;
          residentCompany.shareYourProfile = payload.shareYourProfile;

          await this.residentCompanyRepository.update(residentCompany.id, residentCompany)
            .catch(err => {
              error(`Error in updating resident company details by id: ${residentCompany.id} `, __filename, `updateSpaceChangeWaitlist()`);
              throw new HttpException({
                status: "Error",
                message: COULD_NOT_UPDATE_RESIDENT_COMPANY_ERR_MSG,
                body: err
              }, HttpStatus.INTERNAL_SERVER_ERROR);
            });

          /** Update Resident Company history */
          await this.updateCompanyHistoryAfterSavingSpaceChangeWaitlist(payload, residentCompany).catch(err => {
            error(`Error in updating resident company history `, __filename, `updateSpaceChangeWaitlist()`);
            throw new HttpException({
              status: "Error",
              message: COULD_NOT_UPDATE_RESIDENT_COMPANY_HISTORY_ERR_MSG,
              body: err
            }, HttpStatus.INTERNAL_SERVER_ERROR);
          });

          /** BIOL-308: Notify Site Admin if the sponsorship question changes to Yes. shareYourProfile = true */
          if (!shareYourProfileTemp && payload.shareYourProfile) {
            debug(`Sponsorship contact question changed to: ${payload.shareYourProfile}`, __filename, `updateSpaceChangeWaitlist()`);
            await this.sendEmailToSiteAdmin(siteIdArr, req, residentCompany.companyName, residentCompany.id, ApplicationConstants.EMAIL_FOR_SPONSORSHIP_QN_CHANGE_TO_YES).catch(() => {
              error(`Error in sending email notification to site admin for sponsorship question changes to Yes`, __filename, `updateSpaceChangeWaitlist()`);
            });
            info(`Email sent regarding Sponsorship contact question change to Yes`, __filename, `updateSpaceChangeWaitlist()`);
          }

        } else {
          response['status'] = 'error';
          response['message'] = 'Space Change Waitlist not found by id ' + payload.spaceChangeWaitlistId;
          response['body'] = {};
          debug(`Space Change Waitlist not found by id ${payload.spaceChangeWaitlistId} `, __filename, `updateSpaceChangeWaitlist()`);
          return response;
        }
      } else {
        response['status'] = 'Not acceptable';
        response['message'] = 'Please provide proper details of Space Change Waitlist entry';
        response['body'] = {};
        debug(`Need proper payload of SpaceChangeWaitlist Dto`, __filename, `updateSpaceChangeWaitlist()`);
        return response;
      }
    } catch (e) {
      response['status'] = 'Fail';
      response['message'] = 'Could not update Space Change Waitlist';
      response['body'] = e;
      error(`Error in updating Space Change Waitlist`, __filename, `updateSpaceChangeWaitlist()`);
      return response;
    }
    response['status'] = 'Success';
    response['message'] = 'Space Change Waitlist updated successfully';
    info(`Executed Space Change Waitlist update`, __filename, `updateSpaceChangeWaitlist()`);
    return response;
  }

  /**
   * Description: Delete old item records of SpaceChangeWaitlist and created new updated records.
   * @description Delete old item records of SpaceChangeWaitlist and created new updated records.
   * @param payload The payload to update SpaceChangeWaitlist
   * @param resp 
   */
  public async updateSpaceChangeWaitlistItems(payload: any, spaceChangeWaitlistObj: any) {
    info(`Updating Space Change Waitlist items`, __filename, `updateSpaceChangeWaitlistItems()`);
    if (payload.items && payload.items.length) {
      debug(`Total items present in payload: ${payload.items.length}`, __filename, `updateSpaceChangeWaitlistItems()`);
      await this.itemRepository.delete({ spaceChangeWaitlist_id: payload.spaceChangeWaitlistId }).catch(err => {
        error(`Error in updating Space Change Waitlist items`, __filename, `updateSpaceChangeWaitlistItems()`);
        throw new HttpException({
          status: "Error",
          message: "Error in updating Space Change Waitlist items",
          body: err
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
      for (let itemDto of payload.items) {
        let itemObj: Item = new Item();

        itemObj.productTypeId = itemDto.productTypeId;
        itemObj.itemName = itemDto.itemName;
        itemObj.currentQty = itemDto.currentQty;
        itemObj.desiredQty = itemDto.desiredQty;
        itemObj.spaceChangeWaitlist = spaceChangeWaitlistObj;
        itemObj.spaceChangeWaitlist_id = spaceChangeWaitlistObj.id;
        await this.itemRepository.save(this.itemRepository.create(itemObj)).catch(err => {
          error(`Error in updating Space Change Waitlist item`, __filename, `updateSpaceChangeWaitlistItems()`);
          throw new HttpException({
            status: "Error",
            message: "Error in updating Space Change Waitlist item",
            body: err
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        });
      }
    }
  }

  /**
   * Description: Updates request status of Space Change Waitlist.
   * @description Updates request status of Space Change Waitlist.
   * @param payload payload object with id and status fields
   * @returns response with status and message fields
   */
  public async updateSpaceChangeWaitlistStatus(payload: UpdateWaitlistRequestStatusDto, @Request() req) {
    info(`Updating Space Change Waitlist status id: ${payload.id}, new status: ${payload.status}`, __filename, `updateSpaceChangeWaitlistStatus()`);
    let resp = {};
    try {
      let count = await this.spaceChangeWaitlistRepository.count({ id: payload.id });

      debug(`Count of Space Change Waitlist record by id: ${count}`, __filename, `updateSpaceChangeWaitlistStatus()`);
      if (count < 1) {
        resp['status'] = 'Error';
        resp['message'] = 'Space Change Waitlist not found by id : ' + payload.id;
        resp['body'] = payload;
        return resp;
      }

      await this.spaceChangeWaitlistRepository
        .createQueryBuilder('space_change_waitlist')
        .update()
        .set({ requestStatus: payload.status, modifiedBy: req.user.id })
        .where("id = :id", { id: payload.id })
        .execute();
    } catch (er) {
      resp['status'] = 'Error';
      resp['message'] = 'Error while updating status';
      resp['body'] = er;
      error(`Error while updating Space Change Waitlist status`, __filename, `updateSpaceChangeWaitlistStatus()`);
      return resp;
    }
    resp['status'] = 'Success';
    resp['message'] = 'Status updated successfully';
    resp['body'] = payload;
    info(`Executed updateSpaceChangeWaitlistStatus()`, __filename, `updateSpaceChangeWaitlistStatus()`);
    return resp;
  }

  getMoveInPrefrence() {
    return [
      { id: 1, name: 'Join Biolabs Within : 1 month' },
      { id: 2, name: 'Join Biolabs Within : 2 - 3 months' },
      { id: 3, name: 'Join Biolabs Within : 4 - 6 months' },
      { id: 4, name: 'Join Biolabs Within : More than 6 months' }
    ];
  }
}
