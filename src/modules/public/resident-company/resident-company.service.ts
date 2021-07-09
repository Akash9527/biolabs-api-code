import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMAIL } from 'constants/email';
import { Request } from 'express';
import { In, Like, Repository } from 'typeorm';
import { Mail } from '../../../utils/Mail';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { Modality } from '../master/modality.entity';
import { Site } from '../master/site.entity';
import { TechnologyStage } from '../master/technology-stage.entity';
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
    private readonly mail: Mail,
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

      const historyData: any = JSON.parse(JSON.stringify(payload));
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
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async gloabalSearchCompanies(payload: SearchResidentCompanyPayload, siteIdArr: number[]) {
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
    const queryStr = "SELECT  p. \"productTypeId\",SUM(o.\"cost\" * o.\"quantity\")  From order_product as o " +
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
    const queryStr = `
    SELECT  p."productTypeId", avg(o.quantity) as sumofquantity,
            extract(quarter from make_date(date_part('year', CURRENT_DATE):: int, o.month, 01)) as quarterNo,
            to_char(make_date(date_part('year', CURRENT_DATE):: int, o.month, 01), '"Q"Q.YYYY') AS quat
    fROM
      order_product as o
    INNER JOIN product as p ON p.id = o."productId"
    where
      p.id = o."productId"
      AND "companyId"=${companyId}
      AND p."productTypeId" IN (2,4)
    group by p."productTypeId",
      extract(quarter from make_date(date_part('year', CURRENT_DATE):: int, o.month, 01)),
      to_char(make_date(date_part('year', CURRENT_DATE):: int, o.month, 01), '"Q"Q.YYYY')
    `;

    return await this.residentCompanyHistoryRepository.query(queryStr);
  }

}
