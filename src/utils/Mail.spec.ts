import { Test } from "@nestjs/testing";
import { Mail } from "../utils/Mail";
import { ApplicationConstants } from "./application-constants";

describe('PasswordTransformer', () => {
    let mail;
    let tenant: any = {"tenantEmail":"test@biolabs.io","officialEmail":"test@biolabs.io","role":"test"};
    let token: any = {"token_type":"token_type","access_token":"access_token"};
    let subject: string="Biolabs mail";
    let content: string="test message";
    let companiesCount : any = {"graduatingSoonCompsCount":2,"onboardedCompsCount":2,"graduatedCompsCount":2};
    let sitesApplied : [1,2,3,4,5];
    let userInfo: any = {"userName":"test","origin":"tets-origin","token":"100000000","companiesCount":companiesCount,sitesApplied}
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                Mail,
            ]
        }).compile();

        mail = await module.get<Mail>(Mail);
    });

    it('should be defined', () => {
        expect(mail).toBeDefined();
    });
    it('should test getGrapAPIToken method test', () => {
        expect(mail.getGrapAPIToken()).toBeDefined();
    });

    it('should test sendEmailGraphAPI method', () => {
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method for forgotMail', () => {
        let content: string = "forgotMail";
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method  for Invite', () => {
        let content: string = "Invite";
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method for applicationFormSubmit', () => {
        let content: string = "applicationFormSubmit";
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method for spaceChangeWaitlistSubmit', () => {
        let content: string = "spaceChangeWaitlistSubmit";
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method for sponsorshipQuestionChangedToYes', () => {
        let content: string = "sponsorshipQuestionChangedToYes";
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmailGraphAPI method for user sites info', () => {
        let site_name = [{id: 1}]
        userInfo.site_name = site_name;
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });
    it('should test sendEmailGraphAPI method for sitesApplied', () => {
        let sitesApplied = [{id: 1}]
        userInfo.sitesApplied = sitesApplied;
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmail method ', () => {
        expect( mail.sendEmail(tenant, subject, content, userInfo)).toBeDefined();
    });


    it('should test sendEmail for ONBOARDED_COMPANIES ', () => {
        expect(mail.getCompanyDataHtmlTable(userInfo, ApplicationConstants.ONBOARDED_COMPANIES)).toBeDefined();
    });

    it('should test sendEmail for GRADUATED_COMPANIES ', () => {
        expect(mail.getCompanyDataHtmlTable(userInfo, ApplicationConstants.GRADUATED_COMPANIES)).toBeDefined();
    });

    it('should test sendEmail for GRADUATING_SOON_COMPANIES ', () => {
        expect(mail.getCompanyDataHtmlTable(userInfo, ApplicationConstants.GRADUATING_SOON_COMPANIES)).toBeDefined();
    });

    it('should test getOnboardedCompanyRows method ', () => {
        let onboardedCompsObj : any =['A','B','C'];
        expect(mail.getOnboardedCompanyRows(onboardedCompsObj ,userInfo)).toBeDefined();
    });

    it('should test getOnboardedCompanyRows method for ONBOARDED_COMPANIES', () => {
        expect(mail.getCountText(userInfo,ApplicationConstants.ONBOARDED_COMPANIES)).toBeDefined();
    });
    
    it('should test getOnboardedCompanyRows method for GRADUATED_COMPANIES ', () => {
        expect(mail.getCountText(userInfo,ApplicationConstants.GRADUATED_COMPANIES)).toBeDefined();
    });
    it('should test getOnboardedCompanyRows method for GRADUATING_SOON_COMPANIES', () => {
        expect(mail.getCountText(userInfo,ApplicationConstants.GRADUATING_SOON_COMPANIES)).toBeDefined();
    });

    it('should test getOnboardedCompanyRows method for ONBOARDED_COMPANIES', () => {
        expect(mail.getClickHereToSeeMoreLink(userInfo, ApplicationConstants.ONBOARDED_COMPANIES)).toBeDefined();
    });
    it('should test getOnboardedCompanyRows method fro GRADUATED_COMPANIES', () => {
        expect(mail.getClickHereToSeeMoreLink(userInfo, ApplicationConstants.GRADUATED_COMPANIES)).toBeDefined();
    });
    it('should test getOnboardedCompanyRows method for GRADUATING_SOON_COMPANIES  ', () => {
        expect(mail.getClickHereToSeeMoreLink(userInfo, ApplicationConstants.GRADUATING_SOON_COMPANIES)).toBeDefined();
    });

    it('should test getGraduatedCompanyRows method ', () => {
        let graduatedCompsObj : any =['A','B','C'];
        expect(mail.getGraduatedCompanyRows(graduatedCompsObj,userInfo)).toBeDefined();
    });

    it('should test graduatingSoonCompsObj method ', () => {
        let graduatingSoonCompsObj : any =['A','B','C'];
        expect(mail.getGraduatingSoonCompanyRows(graduatingSoonCompsObj,userInfo)).toBeDefined();
    });

    it('should test prepareCompanyLogoUrl method ', () => {
        let comapnay: any ={'logoUrl':'url'};
        expect(mail.prepareCompanyLogoUrl('apiServerOrigin', 'uiServerOrigin', comapnay.logoUrl)).toBeDefined();
    });
    
    it('should test arrayToCommaSeparatedString method ', () => {
        let array =['a','b','c','d'];
        expect(mail.arrayToCommaSeparatedString(array)).toBeDefined();
    });
    
    it('should test getGraduatingSoonDate method ', () => {
        expect(mail.getGraduatingSoonDate(10000000000000)).toBeDefined();
    });
    
    it('should test getFormattedDateDD_Mon_YYYY method ', () => {
        expect(mail.getFormattedDateDD_Mon_YYYY(new Date())).toBeDefined();
    });
    
});