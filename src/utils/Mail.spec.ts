import { Test } from "@nestjs/testing";
import { Mail } from "../utils/Mail";

describe('PasswordTransformer', () => {
    let mail;
    let tenant: any = {"tenantEmail":"test@biolabs.io","officialEmail":"test@biolabs.io","role":"test"};
    let token: any = {"token_type":"token_type","access_token":"access_token"};
    let subject: string="Biolabs mail";
    let content: string="test message";
    let userInfo: any = {"userName":"test","origin":"tets-origin","token":"100000000"}
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

    it('should test sendEmailGraphAPI method for user sites info', () => {
        let site_name = [{id: 1}]
        userInfo.site_name = site_name;
        expect(mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo)).toBeDefined();
    });

    it('should test sendEmail method ', () => {
        expect( mail.sendEmail(tenant, subject, content, userInfo)).toBeDefined();
    });

});