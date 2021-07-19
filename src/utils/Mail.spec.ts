import { Test } from "@nestjs/testing";
import { Mail } from "../utils/Mail";

describe('PasswordTransformer', () => {
    let mail;
    let tenant: any = {};
    let token: any = {};
    let subject: string;
    let content: string;
    let userInfo: any = {}
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
        mail.getGrapAPIToken();
    });

    it('should test sendEmailGraphAPI method', () => {
        mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo);
    });

    it('should test sendEmailGraphAPI method for forgotMail', () => {
        let content: string = "forgotMail";
        mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo);
    });

    it('should test sendEmailGraphAPI method  for Invite', () => {
        let content: string = "Invite";
        mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo);
    });

    it('should test sendEmailGraphAPI method for applicationFormSubmit', () => {
        let content: string = "applicationFormSubmit";
        mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo);
    });

    it('should test sendEmailGraphAPI method for user sites info', () => {
        let site_name = [{id: 1}]
        userInfo.site_name = site_name;
        mail.sendEmailGraphAPI(tenant, token, subject, content, userInfo);
    });

    it('should test sendEmail method ', () => {
        mail.sendEmail(tenant, subject, content, userInfo);
    });

});