import { HttpException, HttpStatus, Injectable, NotAcceptableException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL } from 'constants/email';
import { In, Like, Repository } from 'typeorm';
import { Mail } from '../../../utils/Mail';
import { AddSpaceChangeWaitlistDto } from '../dto/add-space-change-waitlist.dto';
import { UpdateWaitlistPriorityOrderDto } from '../dto/update-waitlist-priority-order.dto';
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
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';


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
    return this.residentCompanyRepository.findOne(id);
  }

  /**
 * Description: This method is used to update the resident company pitchdeck and logo.
 * @description This method is used to update the  resident company pitchdeck and logo.
 * @param payload object of user information with pitchdeckImgUrl or logoImgUrl
 * @return resident company object
 */
  async updateResidentCompanyImg(payload) {
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
    return await this.residentCompanyRepository
      .createQueryBuilder('resident-companies')
      .where('resident-companies.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  /**
   * Description: This method will create the new resident companies.
   * @description This method will create the new resident companies.
   * @param payload object of AddResidentCompanyPayload.
   * @return resident companies object
   */
  async create(payload: AddResidentCompanyPayload) {
    const rc = await this.getByEmail(payload.email);

    if (rc) {
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
    if (payload.id)
      await this.residentCompanyAdvisoryRepository.update(payload.id, payload)
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in advisor team'
          }, HttpStatus.BAD_REQUEST);
        });
    else {
      delete payload.id;
      await this.residentCompanyAdvisoryRepository.save(this.residentCompanyAdvisoryRepository.create(payload))
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in advisor team'
          }, HttpStatus.BAD_REQUEST);
        });
    }
  }

  /**
   * Description: This method will create the new resident companies advisors.
   * @description This method will create the new resident companies advisors.
   * @param companyMember array of companyMember.
   * @param id number of Company id.
   */
  async residentCompanyAdvisors(Advisors: [], id: number) {
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
    const savedRcDocument = await this.residentCompanyDocumentsRepository.save(this.residentCompanyDocumentsRepository.create(payload));
    return savedRcDocument;
  }

  /**
   * Description: This method will create the new resident companies management.
   * @description This method will create the new resident companies management.
   * @param payload object of ResidentCompanyManagementFillableFields.
   * @return resident companies management object
   */
  async addResidentCompanyManagement(payload: ResidentCompanyManagementFillableFields) {
    if (payload.id)
      await this.residentCompanyManagementRepository.update(payload.id, payload)
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in Management team'
          }, HttpStatus.BAD_REQUEST);
        });
    else {
      delete payload.id;
      await this.residentCompanyManagementRepository.save(this.residentCompanyManagementRepository.create(payload))
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in Management team'
          }, HttpStatus.BAD_REQUEST);
        });
    }
  }

  /**
   * Description: This method will create the new resident companies managements.
   * @description This method will create the new resident companies managements.
   * @param companyMember array of company magmt Member.
   * @param id number of Company id.
   */
  async residentCompanyManagements(companyMembers: [], id: number) {
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
    if (payload.id)
      await this.residentCompanyTechnicalRepository.update(payload.id, payload)
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in technical team'
          }, HttpStatus.BAD_REQUEST);
        });
    else {
      delete payload.id;
      await this.residentCompanyTechnicalRepository.save(this.residentCompanyTechnicalRepository.create(payload))
        .catch(err => {
          throw new HttpException({
            message: err.message + ' in technical team'
          }, HttpStatus.BAD_REQUEST);
        });
    }
  }

  /**
   * Description: This method will create the new resident companies technicals.
   * @description This method will create the new resident companies technicals.
   * @param companyMember array of technical Member.
   * @param id number of Company id.
   */
  async residentCompanyTechnicals(techMembers: [], id: number) {
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
    const rc = await this.getByEmail(payload.email);
    const sites = payload.site;

    if (rc) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    let response = {};

    try {
      for await (const site of payload.site) {
        payload.site = [site];
        const newRc = await this.residentCompanyRepository.create(payload);
        const savedRc = await this.residentCompanyRepository.save(newRc);
        if (savedRc.id) {
          const historyData: any = JSON.parse(JSON.stringify(savedRc));
          historyData.comnpanyId = savedRc.id;
          delete historyData.id;
          await this.residentCompanyHistoryRepository.save(historyData);

          /** Create waitlist entry while saving Resident Company */
          await this.addResidentCompanyDataInWaitlist(savedRc);
        }
      }
      await this.sendEmailToSiteAdmin(sites, req, payload.companyName);
    } catch {
      response['status'] = 'error';
      response['message'] = 'Could not add application';
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
   */
  private async sendEmailToSiteAdmin(site: any, req, companyName: string) {
    let siteAdminEmails = [];
    let userInfo;
    let siteList = [];

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

    userInfo = {
      token: req.headers.authorization,
      company_name: companyName,
      site_name: siteList,
      origin: req.headers['origin'],
    };
    await this.mail.sendEmail(siteAdminEmails, EMAIL.SUBJECT_FORM, 'applicationFormSubmit', userInfo);
  }

  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async getResidentCompanies(payload: ListResidentCompanyPayload, siteIdArr: number[]) {
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
  }

  /**
   * Description: This method will return a resident company by id.
   * @description This method will return a resident company by id.
   * @param payload an id of ResidentCompany
   * @return an objecdt of ResidentCompany
   */
  public async getResidentCompanySpecificFieldsById(residentCompanyId: number) {
    let response = {};
    let residentCompanyObj = await this.fetchResidentCompanyById(residentCompanyId);
    if (residentCompanyObj) {
      response['residentCompanyId'] = residentCompanyObj.id;
      response['companyStageOfDevelopment'] = residentCompanyObj.companyStage;
      response['fundingToDate'] = residentCompanyObj.funding;
      response['fundingSource'] = residentCompanyObj.fundingSource;
      response['TotalCompanySize'] = residentCompanyObj.companySize;
      response['canWeShareYourDataWithSponsorsEtc'] = residentCompanyObj.shareYourProfile;
      return response;
    } else {
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
  }

  /**
   * Description: This method will return the sites list.
   * @description This method will return the sites list.
   * @param ids number[]
   * @return array of sites object
   */
  async getRcSites(ids) {
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
    let response = {};

    const graduate: any = await this.residentCompanyRepository.
      createQueryBuilder("resident_companies").
      select("count(*)", "graduate").
      where("resident_companies.companyStatus = :status", { status: '4' }).getRawOne();

    //Get Sum of all companies and Average company size
    const stats: any = await this.residentCompanyRepository.
      createQueryBuilder("resident_companies").
      select("AVG(resident_companies.companySize)::numeric(10,2)", "avgTeamSize").
      addSelect("count(*)", "startUpcount").
      where("resident_companies.companyStatus = :status", { status: '1' }).
      andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: "true" }).getRawOne();

    const categoryStats = await this.categoryRepository.
      query("SELECT c.name, c.id as industryId, (select count(rc.*) FROM public.resident_companies as rc " +
        "where c.id = ANY(rc.industry::int[]) ) as industryCount " +
        "FROM public.categories as c order by industryCount desc limit 3;");

    response['companyStats'] = (!stats) ? 0 : stats;
    response['graduate'] = (!graduate) ? 0 : graduate;
    response['categoryStats'] = (!categoryStats) ? 0 : categoryStats;

    return response;

  }

  /**
  * Description: This method will get the resident company for sponsor.
  * @description This method will get the resident company for sponsor.
  * @param id number resident company id
  * @return resident company object
  */
  async getResidentCompanyForSponsorBySite() {
    let res = [];

    const sites = await this.siteRepository.find();

    for (let site of sites) {
      let response = {};

      const graduate: any = await this.residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

      //Get Sum of all companies and Average company size
      const companystats: any = await this.residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("AVG(resident_companies.companySize)::numeric(10,2)", "avg").
        addSelect("count(*)", "count").
        where("resident_companies.companyStatus = :status", { status: '1' }).
        andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: "true" }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

      const categoryStats = await this.categoryRepository.
        query("SELECT c.name, c.id  as industryId, (select count(rc.*) FROM resident_companies as rc " +
          "where c.id = ANY(rc.industry::int[]) and " + site.id + " = ANY(rc.site::int[])  ) as industryCount " +
          " FROM public.categories as c order by industryCount desc limit 3;");

      let newStartUps: any = {};
      // try {
      //Get Sum of all New companies onboard in last 3 months
      // newStartUps = await this.residentCompanyRepository.
      // createQueryBuilder("resident_companies").
      // addSelect("count(*)", "newStartUps").
      // where("resident_companies.status = :status", { status: '1' }).
      // where("resident_companies.createdAt  >  '06/01/2021' ").
      // andWhere("resident_companies.companyOnboardingStatus = :companyOnboardingStatus", { companyOnboardingStatus: "true" }).
      // andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

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
    return res;

  }



  /**
   * Description: This method will get the resident company.
   * @description This method will get the resident company.
   * @param id number resident company id
   * @return resident company object
   */
  async getResidentCompany(id) {
    if (id == null) {
      return {};
    }
    const residentCompany: any = await this.residentCompanyRepository.findOne({
      where: { id: id }
    });
    if (residentCompany) {
      residentCompany.sites = await this.getRcSites(residentCompany.site);
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
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }

  /**
   * Description: This method will update the resident company status.
   * @description This method will update the resident company status.
   * @param payload object of type UpdateResidentCompanyStatusPayload
   * @return resident company object
   */
  async updateResidentCompanyStatus(payload: UpdateResidentCompanyStatusPayload) {
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
      return residentCompany;
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }

  /**
   * Description: This method will update the resident company info.
   * @description This method will update the resident company info.
   * @param payload object of type UpdateResidentCompanyPayload
   * @return resident company object
   */
  async updateResidentCompany(payload: UpdateResidentCompanyPayload) {
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
      return await this.getResidentCompany(residentCompany.id);
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
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
  }
  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async gloabalSearchCompanies(payload: SearchResidentCompanyPayload, siteIdArr: number[]) {

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
    // console.log('globalSearch Final ====', globalSearch);

    return await this.residentCompanyRepository.query(globalSearch);
  }

  /**
  * Description: This method is used to create the new note.
  * @description This method is used to create the new note.
  * @param req object of type Request
  * @return note object
  */
  async addNote(payload: AddNotesDto, req: any): Promise<any> {
    const company = await this.residentCompanyRepository.findOne(payload.companyId);
    const note = new Notes();
    note.createdBy = req.user.id;
    note.notes = payload.notes;
    note.residentCompany = company;
    return await this.notesRepository.save(await this.notesRepository.create(note));
  }

  /**
     * Description: This method is used to get a note information.
     * @description This method is used to get a note information.
     * @param id it is a request parameter expect a number value of note id.
     */
  async getNoteById(id: number) {
    return await this.notesRepository.findOne(id);
  }

  /**
   * Description: This method is used to get the note by companyId.
   * @description This method is used to get the note by companyId.
   * @param id number of note id
   * @return notes object
   */
  async getNoteByCompanyId(companyId) {
    return await this.notesRepository
      .createQueryBuilder('notes')
      .select('notes.id', 'id')
      .addSelect("notes.createdAt", 'createdAt')
      .addSelect("notes.notes", "notes")
      .addSelect("usr.firstName", "firstname")
      .addSelect("usr.lastName", "lastname")
      .leftJoin('users', 'usr', 'usr.id = notes.createdBy')
      .where('notes.notesStatus = 1')
      .andWhere("notes.residentCompanyId = :residentCompanyId", { residentCompanyId: companyId })
      .orderBy("notes.createdAt", "DESC")
      .getRawMany();
  }

  /**
     * Description: This method is used to soft delete the note.
     * @description This method is used to soft delete the note.
     * @param id number of note id
     * @return object of affected rows
     */
  async softDeleteNote(id) {
    const note = await this.getNoteById(id);
    if (note) {
      note.notesStatus = 99;
      return await this.notesRepository.save(note);
    } else {
      throw new NotAcceptableException('Note with provided id not available.');
    }
  }

  /**
   * Description: check for null values in object BIOL-224
   * @description check for null values in object BIOL-224
   * @param type type of list like advisors,managements,technicals
   * @param data data to be saved (for advisors,managements,technicals)
   */
  checkEmptyVal(type, data) {
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
      return await repo.save(item);
    } else {
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
    const response = {};
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
    const compResidentHistory = await this.residentCompanyHistoryRepository.query(queryStr);
    response['stagesOfTechnology'] = (!compResidentHistory) ? 0 : compResidentHistory;
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
    const response = {};
    const queryStr = " SELECT MAX(\"funding\" ::Decimal) as \"Funding\", " +
      " extract(quarter from rch.\"createdAt\") as \"quarterNo\", " +
      " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') AS \"quaterText\" " +
      " FROM public.resident_company_history as rch " +
      " WHERE rch.\"site\" = \'{" + siteId + "}\' and rch.\"comnpanyId\" = " + companyId +
      " group by " +
      " extract(quarter from rch.\"createdAt\"), " +
      " to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') " +
      " order by to_char(rch.\"createdAt\", \'\"Q\"Q.YYYY\') ";
    const fundigs = await this.residentCompanyHistoryRepository.query(queryStr);
    response['fundings'] = (!fundigs) ? 0 : fundigs;
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
    const queryStr = "SELECT min(\"createdAt\")  as startWithBiolabs FROM public.resident_company_history" +
      " WHERE \"site\" = \'{" + siteId + "}\' and \"comnpanyId\" = " + companyId +
      "AND \"companyOnboardingStatus\" = true";
    const startWithBiolab = await this.residentCompanyHistoryRepository.query(queryStr);
    return startWithBiolab;
  }
  /**
   * Description: This method returns current month fee details
   * @description This method returns current month fee details
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns current month fee details
   */
  async getFinancialFees(companyId: number) {
    const currentMonth = new Date().getMonth() + 1;
    const queryStr = "SELECT  p. \"productTypeId\",SUM(calculate_prorating(o.\"cost\",o.\"month\",o.\"startDate\",o.\"endDate\",o.\"quantity\",o.\"currentCharge\",o.\"year\"))  From order_product as o " +
      "INNER JOIN product as p ON  p.id =o.\"productId\" " +
      "where p.id = o.\"productId\" " +
      "AND o.\"companyId\"=" + companyId +
      "AND o.\"month\" =  " + currentMonth +
      "AND p.\"productTypeId\" IN(1, 2, 5) " +
      "group by  p.\"productTypeId\" ";
    return await this.residentCompanyHistoryRepository.query(queryStr);
  }

  /**
   * Description: This method returns changes as feeds
   * @description This method returns changes as feeds
   * @param siteId The Site id
   * @param companyId The Company id
   * @returns latest feeds
   */
  async getFeeds(siteId: number, companyId: number) {
    const getFeeds = await this.residentCompanyHistoryRepository.query("SELECT feeds(" + companyId + ")").catch(err => {
      switch (err.code) {
        case '42883':
          throw new HttpException({
            message: err.message + ' in getFeeds'
          }, HttpStatus.NOT_FOUND);
          break;
      }
    });
    // console.log('getFeeds for ' + companyId, getFeeds);
    return getFeeds;
  }

  /**
   * Description: This method returns data to visualize timeline data on graph.
   * @description This method returns data to visualize timeline data on graph.
   * @param companyId The Company id.
   * @returns timeline data.
   */
  async timelineAnalysis(companyId: number) {
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
    return await this.residentCompanyHistoryRepository.query(queryStr);
  }

  /**
   * @description Create waitlist entry while saving Resident Company
   * @param savedRc
   * @param req
   */
  private async addResidentCompanyDataInWaitlist(savedRc: any) {
    const PLAN_CHANGE_SUMMARY_INITIAL_VALUE = 'See Notes';
    const REQUEST_NOTES_INITIAL_VALUE = 'When would you like to join BioLabs?, What equipment and facilities do you plan to primarily use onsite?**';
    const maxPriorityOrder: number = await this.fetchMaxPriorityOrderOfWaitlist().then((result) => {
      return result;
    });

    let productTypes: any = await this.productTypeService.getProductType().then((result) => {
      return result;
    });

    let spaceChangeWaitlistObj = new SpaceChangeWaitlist();
    spaceChangeWaitlistObj.residentCompany = savedRc;
    spaceChangeWaitlistObj.desiredStartDate = null;
    spaceChangeWaitlistObj.planChangeSummary = PLAN_CHANGE_SUMMARY_INITIAL_VALUE;
    spaceChangeWaitlistObj.requestedBy = savedRc.name;
    spaceChangeWaitlistObj.requestStatus = RequestStatusEnum.Open;
    spaceChangeWaitlistObj.fulfilledOn = null;
    spaceChangeWaitlistObj.isRequestInternal = true;
    spaceChangeWaitlistObj.requestNotes = REQUEST_NOTES_INITIAL_VALUE;
    spaceChangeWaitlistObj.internalNotes = null;
    spaceChangeWaitlistObj.siteNotes = null;
    spaceChangeWaitlistObj.priorityOrder = maxPriorityOrder;
    spaceChangeWaitlistObj.site = savedRc.site;
    spaceChangeWaitlistObj.membershipChange = MembershipChangeEnum.UpdateMembership;
    spaceChangeWaitlistObj.requestGraduateDate = null;
    spaceChangeWaitlistObj.marketPlace = null;

    const resp = await this.spaceChangeWaitlistRepository.save(spaceChangeWaitlistObj);

    if (productTypes) {
      for (let index = 0; index < productTypes.length; index++) {
        let item: Item = new Item();
        item.productTypeId = productTypes[index].id;
        item.itemName = productTypes[index].productTypeName;
        item.currentQty = 0;
        item.desiredQty = 0;
        item.spaceChangeWaitlist = resp;
        item.spaceChangeWaitlist_id = resp.id;
        await this.itemRepository.save(this.itemRepository.create(item));
      }
    }
  }

  /**
   * @description Fetch max value of priority order from space_change_waitlist table
   * @returns
   */
  private async fetchMaxPriorityOrderOfWaitlist(): Promise<number> {
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
  public async addToSpaceChangeWaitList(payload: AddSpaceChangeWaitlistDto, @Request() req): Promise<any> {
    const APPROVED_DENIED_PRIORITY_ORDER = -1;
    const residentCompany: ResidentCompany = await this.fetchResidentCompanyById(payload.residentCompanyId).then((result) => {
      return result;
    });
    let response = {};
    if (residentCompany == null) {
      response['status'] = 'Error';
      response['message'] = 'Resident Company not found by id: ' + payload.residentCompanyId;
      return response;
    }

    let maxPriorityOrder: number;
    if (payload.requestStatus == 0) {
      maxPriorityOrder = await this.fetchMaxPriorityOrderOfWaitlist().then((result) => {
        return result;
      });
    } else {
      maxPriorityOrder = APPROVED_DENIED_PRIORITY_ORDER;
    }

    try {
      let spaceChangeWaitlistObj = new SpaceChangeWaitlist();
      spaceChangeWaitlistObj.residentCompany = residentCompany;
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
      let siteIdArr = req.user.site_id;
      // if (req.headers['x-site-id']) {
      //   siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
      // }
      spaceChangeWaitlistObj.site = siteIdArr;
      spaceChangeWaitlistObj.membershipChange = payload.membershipChange;
      spaceChangeWaitlistObj.requestGraduateDate = payload.requestGraduateDate;
      spaceChangeWaitlistObj.marketPlace = payload.marketPlace;

      const resp = await this.spaceChangeWaitlistRepository.save(this.spaceChangeWaitlistRepository.create(spaceChangeWaitlistObj));

      for (let itemDto of payload.items) {
        let itemObj: Item = new Item();

        itemObj.productTypeId = itemDto.productTypeId;
        itemObj.itemName = itemDto.itemName;
        itemObj.currentQty = itemDto.currentQty;
        itemObj.desiredQty = itemDto.desiredQty;
        itemObj.spaceChangeWaitlist = resp;
        await this.itemRepository.save(this.itemRepository.create(itemObj));
      }

      residentCompany.companyStage = payload.companyStage;
      residentCompany.funding = payload.funding;
      residentCompany.fundingSource = payload.fundingSource;
      residentCompany.companySize = payload.companySize;
      await this.residentCompanyRepository.update(residentCompany.id, residentCompany);

      /** Update Resident Company history */
      this.updateCompanyHistoryAfterSavingSpaceChangeWaitlist(payload, residentCompany);
    } catch {
      response['status'] = 'error';
      response['message'] = 'Could not add item in space change wait list';
    }

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
  private async updateCompanyHistoryAfterSavingSpaceChangeWaitlist(payload: any, residentCompany: ResidentCompany) {
    let historyData: any = JSON.parse(JSON.stringify(residentCompany));
    historyData.companyStage = payload.companyStage;
    historyData.funding = payload.funding;
    historyData.fundingSource = payload.fundingSource;
    historyData.companySize = payload.companySize;
    historyData.comnpanyId = residentCompany.id;
    delete historyData.id;
    await this.residentCompanyHistoryRepository.save(historyData);
  }

  /**
   * @description BIOL-275: fetch a resident company by id from db
   * @param residentCompanyId 
   * @returns 
   */
  private async fetchResidentCompanyById(residentCompanyId: number) {
    return await this.residentCompanyRepository.findOne(residentCompanyId);
  }

  /**
   *  Description: BIOL-275 GET spacechange waitlist by status, siteId and companyId.
   * @description GET spacechange waitlist by status, siteId and companyId.
   * @param statusArr array of status (0,1,2)
   * @param siteIdArr array of siteId
   * @param companyId id if the company
   * @returns list of Space Change Waitlist
   */
  public async getSpaceChangeWaitListByStatusSiteIdAndCompanyId(statusArr: number[], siteIdArr: number[], companyId: number): Promise<any> {
    let response = {};
    let status: number[] = [];
    for (let index = 0; index < statusArr.length; index++) {
      status.push(Number(statusArr[index]));
    }

    let waitlistQuery = await this.spaceChangeWaitlistRepository.createQueryBuilder("space_change_waitlist")
      .select("space_change_waitlist.*")
      .addSelect("rc.companyName", "residentCompanyName")
      .leftJoin('resident_companies', 'rc', 'rc.id = space_change_waitlist.residentCompanyId')
      .where("space_change_waitlist.requestStatus IN (:...status)", { status: status });

    if (siteIdArr && siteIdArr.length) {
      waitlistQuery.andWhere("space_change_waitlist.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
    }
    if (companyId && companyId != undefined && companyId > 0) {
      waitlistQuery.andWhere("space_change_waitlist.residentCompanyId = :residentCompanyId", { residentCompanyId: companyId });
    }
    waitlistQuery.orderBy("space_change_waitlist.priorityOrder", "ASC");
    let spaceChangeWaitlist: any = await waitlistQuery.getRawMany();
    response['spaceChangeWaitlist'] = (!spaceChangeWaitlist) ? 0 : spaceChangeWaitlist;
    return response;
  }

  /**
   * @description BIOL-275: GET spacechange waitlist by id
   * @param statusArr
   * @returns
   */
  public async getSpaceChangeWaitListById(id: number): Promise<any> {
    const response = {};

    let spaceChangeWaitlistObj: any = await this.spaceChangeWaitlistRepository.findOne(id, { relations: ['items'] });
    if (spaceChangeWaitlistObj) {
      return spaceChangeWaitlistObj;
    }
    response['status'] = 'error';
    response['message'] = 'Space Change Waitlist not found by id: ' + id;
    return response;
  }

  /**
   * @description Get items for waitlist
   * @param companyId id of Company
   * @returns list of items
   */
  public async getSpaceChangeWaitlistItems(companyId: number) {
    const response = {};
    const month = new Date().getMonth() + 2; // Getting next month from currect date
    const queryStr = `
      select pt.id as "productTypeId", COUNT(op."productTypeId"), pt."productTypeName"
      from product_type as pt
      Left Join (select "productTypeId" from order_product where "companyId" = ${companyId} and month = ${month} ) as op
      on pt.id = op."productTypeId"
      group by op."productTypeId", pt."productTypeName", pt.id
    `;

    const items = await this.residentCompanyHistoryRepository.query(queryStr);
    response['items'] = (!items) ? 0 : items;
    return response;
  }

  /**
   * Description: Updates the priority order of Open space change wait list.
   * @description Updates the priority order of Open space change wait list.
   * @param payload UpdateWaitlistPriorityOrderDto
   * @returns response with status and message fields
   */
  public async updateSpaceChangeWaitlistPriorityOrder(payload: UpdateWaitlistPriorityOrderDto) {
    let response = {};
    try {
      // Should check arraylength whether it is equal to the number of records with request status = 0 present in db
      if (payload && payload.spaceChangeWaitlistIds.length > 0) {
        for (let index = 0; index < payload.spaceChangeWaitlistIds.length; index++) {
          let obj = await this.spaceChangeWaitlistRepository.findOne(payload.spaceChangeWaitlistIds[index]);
          obj.priorityOrder = index;
          await this.spaceChangeWaitlistRepository.update(payload.spaceChangeWaitlistIds[index], obj);
        }
        response['status'] = 'Success';
        response['message'] = 'Priority Order updated successfully';
      } else {
        response['status'] = 'Not acceptable';
        response['message'] = 'Please provide proper Space Change Waitlist ids';
      }
    } catch (error) {
      response['status'] = 'Fail';
      response['message'] = 'Could not update Priority Order';
    }
    return response;
  }
}
