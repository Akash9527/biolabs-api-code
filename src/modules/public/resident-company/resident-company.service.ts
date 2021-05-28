import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { AddResidentCompanyPayload } from './add-resident-company.payload';

import { ResidentCompany } from './resident-company.entity';
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from './rc-advisory.entity'
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from './rc-documents.entity'
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from './rc-management.entity'
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from './rc-technical.entity'

import { Site } from '../master/site.entity';
import { Category } from '../master/category.entity';
import { Funding } from '../master/funding.entity';
import { BiolabsSource } from '../master/biolabs-source.entity';
import { Modality } from '../master/modality.entity';
import { TechnologyStage } from '../master/technology-stage.entity';

import { ListResidentCompanyPayload } from './list-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { ResidentCompanyHistory } from './resident-company-history.entity';
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
    let savedRcAdvisor: object;
    if (payload.id)
      savedRcAdvisor = await this.residentCompanyAdvisoryRepository.update(payload.id, payload);
    else {
      delete payload.id;
      savedRcAdvisor = await this.residentCompanyAdvisoryRepository.save(this.residentCompanyAdvisoryRepository.create(payload));
    }
  }

  /**
   * Description: This method will create the new resident companies advisors.
   * @description This method will create the new resident companies advisors.
   * @param companyMember array of companyMember.
   * @param id number of Company id.
   */
  async residentCompanyAdvisors(companyMembers: [], id: number) {
    if (companyMembers.length > 0) {
      for (let i = 0; i < companyMembers.length; i++) {
        let companyMember: any = companyMembers[i];
        companyMember.companyId = id;
        let savedRcManagement = await this.addResidentCompanyAdvisor(companyMember);
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
    let savedRcManagement: object;
    if (payload.id)
      savedRcManagement = await this.residentCompanyManagementRepository.update(payload.id, payload);
    else {
      delete payload.id;
      savedRcManagement = await this.residentCompanyManagementRepository.save(this.residentCompanyManagementRepository.create(payload));
    }
  }

  /**
   * Description: This method will create the new resident companies managements.
   * @description This method will create the new resident companies managements.
   * @param companyMember array of companyMember.
   * @param id number of Company id.
   */
  async residentCompanyManagements(companyMembers: [], id: number) {
    if (companyMembers.length > 0) {
      for (let i = 0; i < companyMembers.length; i++) {
        let companyMember: any = companyMembers[i];
        companyMember.companyId = id;
        let savedRcManagement = await this.addResidentCompanyManagement(companyMember);
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
    let savedRcTechnical: object;
    if (payload.id)
      savedRcTechnical = await this.residentCompanyTechnicalRepository.update(payload.id, payload);
    else {
      delete payload.id;
      savedRcTechnical = await this.residentCompanyTechnicalRepository.save(this.residentCompanyTechnicalRepository.create(payload));
    }
  }

  /**
   * Description: This method will create the new resident companies technicals.
   * @description This method will create the new resident companies technicals.
   * @param companyMember array of companyMember.
   * @param id number of Company id.
   */
  async residentCompanyTechnicals(companyMembers: [], id: number) {
    if (companyMembers.length > 0) {
      for (let i = 0; i < companyMembers.length; i++) {
        let companyMember: any = companyMembers[i];
        companyMember.companyId = id;
        let savedRcManagement = await this.addResidentCompanyTechnical(companyMember);
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
  async addResidentCompany(payload: AddResidentCompanyPayload) {
    const rc = await this.getByEmail(payload.email);

    if (rc) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }
    const newRc = await this.residentCompanyRepository.create(payload);
    const savedRc = await this.residentCompanyRepository.save(newRc);
    if (savedRc.id) {
      const historyData: any = JSON.parse(JSON.stringify(savedRc));
      historyData.companyId = historyData.id;
      delete historyData.id;
      await this.residentCompanyHistoryRepository.save(historyData);
    }
    return savedRc;
  }

  /**
   * Description: This method will return the resident companies list.
   * @description This method will return the resident companies list.
   * @param payload object of ListResidentCompanyPayload
   * @return array of resident companies object
   */
  async getResidentCompanies(payload: ListResidentCompanyPayload, siteIdArr: number[]) {
    let rcQuery = await this.residentCompanyRepository.createQueryBuilder("resident_companies")
      .where("resident_companies.status IN (:...status)", { status: [1, 0] })
      .andWhere("resident_companies.site && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });

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
    rcQuery.orderBy("id", "DESC");
    return await rcQuery.getMany();
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
        where: { companyId: id },
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
        where: { companyId: id },
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
        where: { companyId: id },
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
      where("resident_companies.status = :status", { status: '4' }).getRawOne();

    //Get Sum of all companies and Average company size
    const stats: any = await this.residentCompanyRepository.
      createQueryBuilder("resident_companies").
      select("AVG(resident_companies.companySize)::numeric(10,2)", "avgTeamSize").
      addSelect("count(*)", "startUpcount").
      where("resident_companies.status = :status", { status: '1' }).
      andWhere("resident_companies.companyVisibility = :companyVisibility", { companyVisibility: "true" }).getRawOne();

    const categoryStats = await this.categoryRepository.
      query("SELECT c.name, c.id as industryId, (select count(rc.*) FROM public.resident_companies as rc " +
        "where c.id = ANY(rc.industry::int[]) ) as industryCount " +
        "FROM public.categories as c order by industryCount desc limit 3;")

    if (!stats) {
      return { startUpcount: 0, avgTeamSize: 0, graduate: 0 };
    }
    response['companyStats'] = stats;
    response['graduate'] = graduate;
    response['categoryStats'] = categoryStats;

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
        where("resident_companies.status = :status", { status: '4' }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

      //Get Sum of all companies and Average company size
      const companystats: any = await this.residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("AVG(resident_companies.companySize)::numeric(10,2)", "avg").
        addSelect("count(*)", "count").
        where("resident_companies.status = :status", { status: '1' }).
        andWhere("resident_companies.companyVisibility = :companyVisibility", { companyVisibility: "true" }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: site.id }).getRawOne();

      const categoryStats = await this.categoryRepository.
        query("SELECT c.name, c.id  as industryId, (select count(rc.*) FROM public.resident_companies as rc " +
          "where c.id = ANY(rc.industry::int[]) and " + site.id + " = ANY(rc.site::int[])  ) as industryCount " +
          "FROM public.categories as c order by industryCount desc limit 3;");
      if (!companystats) {
        return { count: 0, avg: 0 };
      }
      response['site'] = site;
      response['graduate'] = graduate;
      response['companyStats'] = companystats;
      response['categoryStats'] = categoryStats;
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
      if (Number(residentCompany.companyStatus) !== 1)
        residentCompany.companyVisibility = false;
      this.residentCompanyRepository.update(residentCompany.id, residentCompany);
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

    const residentCompanyEmailChk: any = await this.residentCompanyRepository.findOne({
      where: { id: Not(payload.id), email: payload.email }
    });
    if (residentCompanyEmailChk) {
      throw new NotAcceptableException(
        'User with provided email already existed.',
      );
    }
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
      historyData.companyId = historyData.id;
      delete historyData.id;

      await this.residentCompanyHistoryRepository.save(historyData);
      return await this.getResidentCompany(residentCompany.id);
    } else {
      throw new NotAcceptableException(
        'Company with provided id not available.',
      );
    }
  }
}