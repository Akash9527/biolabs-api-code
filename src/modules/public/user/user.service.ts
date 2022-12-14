import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { In, Not, Repository } from 'typeorm';
import { ApplicationConstants } from 'utils/application-constants';
import { EMAIL } from '../../../constants/email';
import { Mail } from '../../../utils/Mail';
import { EmailFrequency } from '../enum/email-frequency-enum';
import { ResidentCompanyService } from '../resident-company/resident-company.service';
import { ListUserPayload } from './list-user.payload';
import { UserToken } from './user-token.entity';
import { User, UserFillableFields } from './user.entity';

const { info, error, debug, warn } = require('../../../utils/logger');
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly residentCompanyService: ResidentCompanyService,
    private readonly mail: Mail,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>
  ) { }

  /**
   * Description: This method is used to get the user information by id.
   * @description This method is used to get the user information by id.
   * @param id number user id
   * @return user object
   */
  async get(id: number) {
    info("Getting user information by user ID :" + id, __filename, "get()");
    return this.userRepository.findOne(id);
  }

  /**
   * Description: This method is used to get the user information by email.
   * @description This method is used to get the user information by email.
   * @param email string user email
   * @return user object
   */
  async getByEmail(email: string) {
    info("Getting user information by user email ID :" + email, __filename, "getByEmail()");
    try {
      return await this.userRepository
        .createQueryBuilder('users')
        .addSelect("users.email")
        .addSelect("users.password")
        .where('users.email = :email')
        .setParameter('email', email)
        .getOne();
    } catch (er) {
      error("Getting error in find user by email id " + email, __filename, "getByEmail()");
      throw new BiolabsException(er);
    }
  }

  /**
   * Description: This method is used to create the new user.
   * @description This method is used to create the new user.
   * @param payload object of type UserFillableFields
   * @return user object
   */
  async create(payload: UserFillableFields, siteData: any) {
    info("Creating a new biolabs user", __filename, "create()");
    const user = await this.getByEmail(payload.email);
    if (user) {
      if (user.email == ApplicationConstants.SUPER_ADMIN_EMAIL_ID) {
        const siteArr = siteData.map((site) => site.id);
        const userObj = {
          "email": payload.email,
          "role": payload.role,
          "site_id": siteArr,
          "firstName": payload.firstName,
          "lastName": payload.lastName,
          "title": payload.title,
          "phoneNumber": payload.phoneNumber,
          "status": payload.status
        }
        return await this.userRepository.update(user.id, userObj)
      } else {
        debug("User with provided email already created", __filename, "create()");
        throw new NotAcceptableException('User with provided email already created.',
        );
      }
    }
    return await this.userRepository.save(this.userRepository.create(payload));
  }

  /**
   * Description: This method is used to create the new user.
   * @description This method is used to create the new user.
   * @param payload object of type UserFillableFields
   * @param req object of type Request
   * @return user object
   */
  async addUser(payload: UserFillableFields, req: Request) {
    debug("Adding a new biolabs user" + payload.email, __filename, "addUser()");
    let savedUser: any = null;
    try {
      const user = await this.getByEmail(payload.email);
      if (user) {
        debug("User with provided email already created", __filename, "addUser()");
        throw new NotAcceptableException('User with provided email already created.');
      }
      const newUser = await this.userRepository.create(payload);
      savedUser = await this.userRepository.save(newUser);
      const userInformation = await this.generateToken(savedUser);
      const userInfo = {
        token: userInformation.token,
        userName: savedUser.firstName,
        origin: req.headers['origin'],
        userRole: payload.role
      };
      let tenant = { tenantEmail: payload.email };
      this.mail.sendEmail(tenant, EMAIL.SUBJECT_INVITE_USER, 'Invite', userInfo);
      info("User added successfully", __filename, "addUser(");
    } catch (err) {
      error("Getting error to create the new user " + err.message, __filename, "addUser()");
      throw new InternalException('Getting error to create the new user', err.message);

    }
    return savedUser;
  }

  /**
   * Description: This method is used to update the user.
   * @description This method is used to update the user.
   * @param payload object of user information
   * @return user object
   */
  async updateUser(payload) {
    debug("Updating user " + payload.email, __filename, "updateUser()");
    const user = await this.get(payload.id);
    try {
      if (user) {
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.title = payload.title;
        user.phoneNumber = payload.phoneNumber;
        user.companyId = (payload.companyId) ? payload.companyId : user.companyId;
        user.userType = payload.userType;
        user.site_id = (payload.site_id) ? payload.site_id : user.site_id;
        if (
          payload.password &&
          payload.password !== '' &&
          payload.password != null
        ) {
          user.password = payload.password;
        } else {
          delete user.password;
        }
        if (payload.hasOwnProperty('isRequestedMails')) {
          user.isRequestedMails = payload.isRequestedMails;
        }
        if (payload.mailsRequestType) {
          user.mailsRequestType = payload.mailsRequestType;
        }
        await this.userRepository.update(user.id, user);
        info("User updated successfully", __filename, "updateUser(");
        if (user.password) delete user.password;
        return await this.getUserById(user.id);
      } else {
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Getting error to create the new user " + err.message, __filename, "updateUser()");
      throw new BiolabsException('Getting error in updating user', err.message);
    }
  }

  /**
   * Description: This method is used to update the user profile pic.
   * @description This method is used to update the user profile pic.
   * @param payload object of user information with imageUrl
   * @return user object
   */
  async updateUserProfilePic(payload) {
    info("Updating the user profile picture " + payload.email);
    const user = await this.get(payload.id);
    try {
      if (user) {
        delete user.password;
        user.imageUrl = payload.imageUrl;
        await this.userRepository.update(user.id, user);
        return user;
      } else {
        error("User with provided id not available." + payload.id, __filename, "updateUserProfilePic()");
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Getting error in updating the user profile picture" + err.message, __filename, "updateUserProfilePic()");
      throw new BiolabsException('Getting error in updating the user profile picture', err.message);

    }
  }

  /**
   * Description: This method is used to soft delete the user.
   * @description This method is used to soft delete the user.
   * @param id number of user id
   * @return object of affected rows
   */
  async softDeleteUser(id) {
    info("Inside soft delete the user userId " + id, __filename, "softDeleteUser()");
    const FOR_DELETE_USER = "Deleted";
    const FOR_USER = "User";
    try {
      const user = await this.get(id);
      if (user) {
        user.status = '99';
        user.email = FOR_DELETE_USER;
        user.firstName = FOR_USER;
        user.lastName = FOR_DELETE_USER;
        user.password = FOR_DELETE_USER;
        user.phoneNumber = FOR_DELETE_USER;
        user.imageUrl = FOR_DELETE_USER;
        user.title = FOR_DELETE_USER;
        debug("Before Saving", __filename, "softDeleteUser()");
        return await this.userRepository.save(user);
      } else {
        error("User with provided id not available." + id, __filename, "softDeleteUser()");
        throw new NotAcceptableException('User with provided id not available.');
      }
    } catch (err) {
      error("Error in soft delete user", __filename, "softDeleteUser()");
      throw new BiolabsException('Error in soft delete user', err);
    }
  }

  /**
   * Description: This method is used to list the user.
   * @description This method is used to list the user.
   * @param payload object of type ListUserPayload
   * @return array of user object
   */
  async getUsers(payload: ListUserPayload, siteIdArr?: number[]) {
    info("Getting list of user", __filename, "getUsers()");
    let userQuery = await this.userRepository.createQueryBuilder("users")
      .where("users.status IN (:...status)", { status: [1, 0] })
      .andWhere("users.site_id && ARRAY[:...siteIdArr]::int[]", { siteIdArr: siteIdArr });
    if (payload.role || payload.role == 0) {
      userQuery.andWhere("users.role = :role", { role: payload.role });
    }
    if (payload.q && payload.q != '') {
      userQuery.andWhere("(users.firstName LIKE :name OR users.lastName LIKE :name) ", { name: `%${payload.q}%` });
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
      userQuery.skip(skip).take(take)
    }
    userQuery.addOrderBy("users.firstName", "ASC");
    userQuery.addOrderBy("users.lastName", "ASC");
    debug("Getting list of user by query : ", __filename, "getUsers()");
    return await userQuery.getMany();
    // return await this.userRepository.find({
    //   where: search,
    //   skip,
    //   take,
    // });

  }

  /**
   * Description: This method is used to get the user by id.
   * @description This method is used to get the user by id.
   * @param id number of user id
   * @return user object
   */
  async getUserById(id) {
    info("Getting user by Id : " + id, __filename, "getUserById()");
    const user: any = await this.get(id);
    if (user) {
      if (user.companyId) {
        const company = await this.residentCompanyService.getResidentCompany(
          user.companyId, null
        );
        if (company) user.company = company;
      }
      return user;
    } else {
      error("User with provided id not available.", __filename, "getUserById()");
      throw new NotAcceptableException('User with provided id not available.');
    }
  }

  /**
   * Description: This method is used to validate the user token.
   * @description This method is used to validate the user token.
   * @param token string
   * @return user object
   */
  async validateToken(token: string) {
    info("Validating user token : " + token, __filename, "validateToken()");
    try {
      const tokenData = await this.userTokenRepository.findOne({
        where: [{ token: token, status: 1 }],
      });
      if (tokenData) {
        const user = await this.get(tokenData.user_id);
        if (user.status == '1' || user.status == '0') return user;
        else {
          error("Token is invalid", __filename, "setNewPassword()");
          throw new NotAcceptableException('Token is invalid.');
        }
      } else {
        error("Token is invalid", __filename, "setNewPassword()");
        throw new NotAcceptableException('Token is invalid.');
      }
    } catch (err) {
      error("Getting error in validating the user token", __filename, "validateToken()");
      throw new BiolabsException('Getting error in validating the user token' + err.message);
    }
  }

  /**
   * Description: This method is used to set new password for the user.
   * @description This method is used to set new password for the user.
   * @param payload object of user info asnd new passsword
   * @return user object
   */
  async setNewPassword(payload) {
    info("Setting the user's new password. email : " + payload.email);
    const tokenData = await this.userTokenRepository.findOne({
      where: [{ token: payload.token, status: 1 }],
    });
    if (tokenData) {
      const user = await this.get(tokenData.user_id);
      if (user.status == '1' || user.status == '0') {
        user.password = payload.password;
        user.status = '1';
        const newUser = await this.userRepository.save(user);
        tokenData.status = '99';
        this.userTokenRepository.save(tokenData);
        return newUser;
      } else {
        error("Token is invalid", __filename, "setNewPassword()");
        throw new NotAcceptableException('Token is invalid.');
      }
    } else {
      error("Token is invalid", __filename, "setNewPassword()");
      throw new NotAcceptableException('Token is invalid.');
    }
  }

  /**
   * Description: This method is used to generate the token for the user.
   * @description This method is used to generate the token for the user.
   * @param user object of user info asnd new passsword
   * @return user object
   */
  async generateToken(user) {
    info("Generate the token for the user" + user.email, __filename, "generateToken()");
    try {
      let token = this.jwtService.sign({
        id: user.id,
        time: new Date().getTime(),
      });
      const tokenData = { user_id: user.id, token: token };
      const tokenChk = await this.userTokenRepository.find({
        where: [{ user_id: user.id, status: '1' }],
      });
      if (tokenChk) {
        await this.userTokenRepository.update(
          { user_id: user.id },
          { status: '99' },
        );
      }
      return await this.userTokenRepository.save(
        this.userTokenRepository.create(tokenData),
      );
    } catch (err) {
      error("Getting error in generating user token", __filename, "generateToken()");
      throw new BiolabsException('Getting error in generating user token', err.message);
    }
  }

  /**
   * Description: This method is used to generate the token for the user to reset the password.
   * @description This method is used to generate the token for the user to reset the password.
   * @param payload object of user info for reset passsword
   * @param req object of Request
   * @return user object
   */
  async forgotPassword(payload: UserFillableFields, req: Request) {
    info("Generate the token for the user to reset the password" + payload.email, __filename, "forgotPassword()");
    try {
      const user = await this.getByEmail(payload.email);
      if (user) {
        const userInformation = await this.generateToken(user);
        const userInfo = {
          token: userInformation.token,
          userName: user.firstName,
          origin: req.headers['origin'],
        };
        let tenant = { tenantEmail: payload.email, role: payload.role };
        this.mail.sendEmail(
          tenant,
          EMAIL.SUBJECT_FORGOT_PASSWORD,
          'forgotMail',
          userInfo,
        );
        return true;
      } else {
        throw new NotAcceptableException(
          'User with provided email already created.',
        );
      }
    } catch (err) {
      error("Getting error in forget password process or sending email", __filename, "forgotPassword()");
      throw new BiolabsException('Getting error in forget password process', err.message);
    }
  }

  // =========================== BIOL-235/BIOL-162 ===========================
  /**
  * Description: Fetches sponsor users, fetch their onboared and graduated companies by sites, and send email.
  * @description Fetches sponsor users, fetch their onboared and graduated companies by sites, and send email.
  * @param emailFrequency Frequency of sending email like: Weekly, Monthly, Quarterly.
  */
  async handleSponsorEmailSchedule(emailFrequency: EmailFrequency) {
    info(`Fetch sponsor users and company data for email frequency: ${emailFrequency}`, __filename, `handleSponsorEmailSchedule()`);

    try {
      const sponsorUsers: any = await this.fetchSponsorUsers(emailFrequency).then((result) => {
        return result;
      });

      if (sponsorUsers && Array.isArray(sponsorUsers)) {
        debug(`Fetched sponsor users: ${sponsorUsers.length}`, __filename, `handleSponsorEmailSchedule()`);

        //Fetch all sites from DB.
        let sitesArrDb: any = await this.residentCompanyService.getAllSites().then((result) => {
          return result;
        });

        if (sitesArrDb && Array.isArray(sitesArrDb)) {
          debug(`Fetched sites from db: ${sitesArrDb.length}`, __filename, `handleSponsorEmailSchedule()`);
        } else {
          debug(`Fetched sites from db: ${sitesArrDb}`, __filename, `handleSponsorEmailSchedule()`);
        }

        //Fetch all first level industries from DB.
        let firstLevelIndustries = await this.residentCompanyService.getIndustriesByParentId(0);
        if (firstLevelIndustries && Array.isArray(firstLevelIndustries)) {
          debug(`Fetched first level industries from db: ${firstLevelIndustries.length}`, __filename, `handleSponsorEmailSchedule()`);
        } else {
          debug(`Fetched first level industries from db: ${firstLevelIndustries}`, __filename, `handleSponsorEmailSchedule()`);
        }

        for (const user of sponsorUsers) {

          info(`Fetching company data for userId: ${user.id}`, __filename, `handleSponsorEmailSchedule()`);
          let onboardedComps = await this.residentCompanyService.fetchOnboardedCompaniesBySiteId(user.site_id, ApplicationConstants.ONBOARDED_COMPANIES, emailFrequency, ApplicationConstants.FREQUENCY).then((result) => {
            return result;
          });

          /** Fetch and set industry names for onboarded companies */
          await this.traverseAndSetIndustryNames(onboardedComps, firstLevelIndustries);

          /** Filter onboarded resident companies by site */
          let onboardedGroupedCompsObj = await this.prepareFilteredArrayOfResidentComps(onboardedComps, user.site_id, sitesArrDb);

          info(`Filtered onboarded resident companies`, __filename, `handleSponsorEmailSchedule()`);

          /** Graduated resident companies */
          let graduatedComps = await this.residentCompanyService.fetchOnboardedCompaniesBySiteId(user.site_id, ApplicationConstants.GRADUATED_COMPANIES, emailFrequency, ApplicationConstants.FREQUENCY).then((result) => {
            return result;
          });

          /** Fetch and set industry names for graduated companies */
          await this.traverseAndSetIndustryNames(graduatedComps, firstLevelIndustries);

          /** Filter graduated resident companies by site */
          let graduatedGroupedCompsObj = await this.prepareFilteredArrayOfResidentComps(graduatedComps, user.site_id, sitesArrDb);

          /** Graduating soon resident companies */
          let graduatingSoonComps = await this.residentCompanyService.getGraduatingSoonCompanies(user.site_id, emailFrequency);
          let graduatingSoonGroupedCompsObj = await this.prepareFilteredArrayOfResidentComps(graduatingSoonComps, user.site_id, sitesArrDb);

          let companiesCount = this.getCompanyCount(onboardedComps, graduatedComps, graduatingSoonComps);

          info(`Filtered onboarded resident companies`, __filename, `handleSponsorEmailSchedule()`);

          /** Send mail to the user */
          this.sendScheduledMailToSponsor(user, onboardedGroupedCompsObj, graduatedGroupedCompsObj, graduatingSoonGroupedCompsObj, companiesCount);
        } //loop
      } else {
        error(`Sponsor users found: ${sponsorUsers}`, __filename, `handleSponsorEmailSchedule()`);
      }
    } catch (err) {
      error(`Error in handling scheduled mail sending to sponsor users ${emailFrequency}`, __filename, `handleSponsorEmailSchedule()`);
      throw new BiolabsException(`Error in handling scheduled mail sending to sponsor users ${emailFrequency}`, err.message);
    }
  }

  /**
   * Description: Prepares filterd array of resident companies by site name.
   * @description Prepares filterd array of resident companies by site name.
   * @param residentCompanies Array of resident company objects
   * @param userSiteIds Site id array of user
   * @param siteArray Site array 
   * @returns Filtered array of resident company objects
   */
  prepareFilteredArrayOfResidentComps(residentCompanies: any, userSiteIds: number[], siteArray: number[]) {
    info(`Filtering company data according to sites`, __filename, `prepareFilteredArrayOfResidentComps()`);
    let residentCompanyObj = {};
    try {
      if (residentCompanies && Array.isArray(residentCompanies)) {
        for (let userSiteId of userSiteIds) {
          let siteName = this.getSiteNameBySiteId(siteArray, userSiteId);
          const compsOfSite = residentCompanies.filter((comp) => comp.site.indexOf(userSiteId) >= 0);
          residentCompanyObj[siteName] = compsOfSite;
        }
      } else {
        warn(`Resident companies: ${residentCompanies}`, __filename, `prepareFilteredArrayOfResidentComps()`);
      }
    } catch (err) {
      error(`Error in preparing filtered array.`, __filename, `prepareFilteredArrayOfResidentComps()`);
      throw new BiolabsException(`Error in preparing filtered array.`, err.message);
    }
    return residentCompanyObj;
  }

  /**
   * Description: Fetch the Sponsor users who want to receive mails by thier email receiving frequency.
   * @description Fetch the Sponsor users who want to receive mails by thier email receiving frequency.
   * @param mailsRequestType Frequency of sending email like: Weekly, Monthly, Quarterly.
   * @returns list of Sponsor users who wish to receive emails
   */
  async fetchSponsorUsers(mailsRequestType: EmailFrequency) {
    info(`Fetch sponsor users for email frequency: ${mailsRequestType}`, __filename, `fetchSponsorUsers()`);
    const EXCLUDE_USER_WITH_STATUS = [99, -1]
    const sponsorUsers = await this.userRepository.find({
      where: { role: ApplicationConstants.SPONSOR_USER_ROLE, status: Not(In(EXCLUDE_USER_WITH_STATUS)), isRequestedMails: true, mailsRequestType: mailsRequestType }
    }).then((result) => {
      return result;
    }).catch(err => {
      error(`Error in fetching sponsor users. ${err.message}`, __filename, `fetchSponsorUsers()`);
      throw new BiolabsException(`Error in fetching sponsor users.`, err.message);
    });
    return sponsorUsers;
  }

  /**
   * Description: Send mail to Sponsor user with list of onboarded and graduated companies.
   * @description Send mail to Sponsor user with list of onboarded and graduated companies.
   * @param user Sponsor User object
   * @param onboardedCompanies list of onboarded companies
   * @param graduatedCompanies list of graduated companies
   */
  sendScheduledMailToSponsor(user: User, onboardedGroupedCompsObj: any, graduatedGroupedCompsObj: any, graduatingSoonGroupedCompsObj: any, companiesCount: any) {
    info(`Prepare email config data`, __filename, `sendScheduledMailToSponsor()`);
    try {
      if (user) {
        const userInfo = {
          userName: user.firstName,
          api_server_origin: process.env.API_SERVER_ORIGIN,
          ui_server_origin: process.env.UI_SERVER_ORIGIN,
          onboardedCompsObj: onboardedGroupedCompsObj,
          graduatedCompsObj: graduatedGroupedCompsObj,
          graduatingSoonCompsObj: graduatingSoonGroupedCompsObj,
          companiesCount: companiesCount
        };
        let tenant = { tenantEmail: user.email, role: user.role };

        debug(`API server origin in config data : ${userInfo.api_server_origin}`, __filename, `sendScheduledMailToSponsor()`);
        const currentDate: Date = new Date();
        this.mail.sendEmail(
          tenant,
          ApplicationConstants.EMAIL_SUBJECT_FOR_SPONSOR_SCHEDULED.replace('{0}', this.mail.getFormattedDateDD_Mon_YYYY(currentDate)),
          ApplicationConstants.EMAIL_PARAM_FOR_SPONSOR_MAIL_SCHEDULED,
          userInfo,
        );
      } else {
        error(`Not proper user object: ${user}`, __filename, `sendScheduledMailToSponsor()`);
        throw new NotAcceptableException(
          `Not proper user object: ${user}`,
        );
      }
    } catch (err) {
      error(`Error in sending email to sponsor user`, __filename, `sendScheduledMailToSponsor()`);
      throw new BiolabsException(`Error in sending email to sponsor user.`, err.message);
    }
  }

  /**
   * Description: Filters resident company objects which have the passed site id.
   * @description Filters resident company objects which have the passed site id. 
   * @param companies Array of resident company objects
   * @param siteId A site id
   * @returns Array of resident companies objects which have passed site id.
   */
  filterCompaniesBySiteId(companies: any, siteId: number) {
    info(`Filtering Error in sending email to sponsor user`, __filename, `sendScheduledMailToSponsor()`);
    return companies.filter((comp) => comp.site.indexOf(siteId) >= 0);
  }

  /**
   * Description: Fetches site name form site array by site id.
   * @description Fetches site name form site array by site id.
   * @param siteArrDb Array of site objects.
   * @param siteId A site id
   * @returns Site name
   */
  getSiteNameBySiteId(siteArrDb: any[], siteId: number) {
    info(`Fetching site name from site array`, __filename, `getSiteName()`);
    let filteredArray = siteArrDb.filter((x) => x.id == siteId);
    if (filteredArray && filteredArray.length) {
      return filteredArray[0].name;
    }
    return null;
  }

  /**
   * Description: Counts onboarded, graduated, graduating soon companies based on their list size.
   * @description Counts onboarded, graduated, graduating soon companies based on their list size.
   * @param onboardedComps list of onboarded companies
   * @param graduatedComps list of graduated companies
   * @param graduatingSoonComps list of graduating soon companies
   * @returns return an object with count of the resident companies
   */
  getCompanyCount(onboardedComps, graduatedComps, graduatingSoonComps) {
    info(`Get company count by size of list`, __filename, `getCompanyCount()`);
    let companiesCount: any = {
      onboardedCompsCount: 0,
      graduatedCompsCount: 0,
      graduatingSoonCompsCount: 0
    };

    if (onboardedComps && Array.isArray(onboardedComps)) {
      companiesCount.onboardedCompsCount = onboardedComps.length;
      debug(`Onboarded companies size: ${onboardedComps.length}`, __filename, `getCompanyCount()`);
    }
    if (graduatedComps && Array.isArray(graduatedComps)) {
      companiesCount.graduatedCompsCount = graduatedComps.length;
      debug(`Graduated companies size: ${graduatedComps.length}`, __filename, `getCompanyCount()`);
    }
    if (graduatingSoonComps && Array.isArray(graduatingSoonComps)) {
      companiesCount.graduatingSoonCompsCount = graduatingSoonComps.length;
      debug(`Graduating soon companies size: ${graduatingSoonComps.length}`, __filename, `getCompanyCount()`);
    }
    return companiesCount;
  }

  /**
   * Description: Finds out the selected industry names as per resident companies.
   * @description Finds out the selected industry names as per resident companies.
   * @param residentCompanies list of resident companies
   * @param firstLevelIndustries industry list which dont have parent(first level industries)
   */
  async traverseAndSetIndustryNames(residentCompanies, firstLevelIndustries) {
    info(`Traversing the industries to fetch selected industries`, __filename, `traverseAndSetIndustryNames()`);
    if (residentCompanies && Array.isArray(residentCompanies)) {
      for (const company of residentCompanies) {
        let firstLevelSelected = [];
        if (firstLevelIndustries) {
          for (const firstLevelIndustry of firstLevelIndustries) {
            let secondLevelIndustries = await this.residentCompanyService.getIndustriesByParentId(firstLevelIndustry.id);
            let secondLevelSelected = [];
            if (secondLevelIndustries) {
              for (const secondLevelIndustry of secondLevelIndustries) {
                let thirdLevelIndustries = await this.residentCompanyService.getIndustriesByParentId(secondLevelIndustry.id);
                let thirdLevelSelected = [];
                if (thirdLevelIndustries) {
                  for (const thirdLevelIndustry of thirdLevelIndustries) {
                    if (company.industry.indexOf(thirdLevelIndustry.id) >= 0) {
                      if (thirdLevelIndustry.name == 'Other') {
                        let key = Object.keys(company.otherIndustries).find(key => {
                          if (key == thirdLevelIndustry.id.toString()) {
                            return key
                          }
                        });
                        thirdLevelIndustry.name = company.otherIndustries[key];
                      }
                      thirdLevelSelected.push(thirdLevelIndustry);
                    }
                    if (thirdLevelSelected.length > 1) { break; }
                  } //Third level loop
                }
                if (company.industry.indexOf(secondLevelIndustry.id) >= 0) {
                  if (secondLevelIndustry.name == 'Other') {
                    let key = Object.keys(company.otherIndustries).find(key => {
                      if (key == secondLevelIndustry.id.toString()) {
                        return key
                      }
                    });
                    secondLevelIndustry.name = company.otherIndustries[key];
                  }
                  secondLevelSelected.push(secondLevelIndustry);
                }
                if (thirdLevelSelected.length > 1) {
                  secondLevelSelected.push(secondLevelIndustry);
                } else if (thirdLevelSelected.length == 1) {
                  secondLevelSelected.push(thirdLevelSelected[0]);
                }
                if (secondLevelSelected.length > 1) { break; }
              } //Second level loop
            }
            if (company.industry.indexOf(firstLevelIndustry.id) >= 0) {
              if (firstLevelIndustry.name == 'Other') {
                let key = Object.keys(company.otherIndustries).find(key => {
                  if (key == firstLevelIndustry.id.toString()) {
                    return key
                  }
                });
                firstLevelIndustry.name = company.otherIndustries[key];
              }
              firstLevelSelected.push(firstLevelIndustry);
            }
            if (secondLevelSelected.length > 1) {
              firstLevelSelected.push(firstLevelIndustry);
            } else if (secondLevelSelected.length == 1) {
              firstLevelSelected.push(secondLevelSelected[0]);
            }
          }
        }
        let finalSelected = firstLevelSelected.map((cat) => {
          return cat.name;
        });
        company.industryNames = finalSelected;
        debug(`After traversing the industries selected industries are: ${finalSelected}`, __filename, `traverseAndSetIndustryNames()`);
      }
    } else {
      warn(`Onboarded resident companies: ${residentCompanies}`, __filename, `traverseAndSetIndustryNames()`);
    }
  }
}