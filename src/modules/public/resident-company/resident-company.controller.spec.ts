
import { ResidentCompanyController } from './resident-company.controller';
import { Test, TestingModule } from "@nestjs/testing";
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../../config';
import { HTTP_CODES } from '../../../utils/httpcode';
import { Mail } from '../../../utils/Mail';
import { ResidentCompanyService } from './resident-company.service';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { UpdateResidentCompanyPayload } from './update-resident-company.payload';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { UpdateWaitlistPriorityOrderDto } from '../dto/update-waitlist-priority-order.dto';
import { UpdateSpaceChangeWaitlistDto } from '../dto/update-space-change-waitlist.dto';
import { UpdateWaitlistRequestStatusDto } from '../dto/update-waitlist-request-status.dto';
import { Notes } from './rc-notes.entity';
import { UpdateNotesDto } from './update-notes.dto';

const mockResidentService = () => ({
    addResidentCompany: jest.fn(),
    getResidentCompanies: jest.fn(),
    getResidentCompanyForSponsor: jest.fn(),
    updateResidentCompanyStatus: jest.fn(),
    updateResidentCompany: jest.fn(),
    gloabalSearchCompanies: jest.fn(),
    getResidentCompany: jest.fn(),
    addNote: jest.fn(),
    getNoteByCompanyId: jest.fn(),
    softDeleteNote: jest.fn(),
    softDeleteMember: jest.fn(),
    getStagesOfTechnologyBySiteId: jest.fn(),
    getFundingBySiteIdAndCompanyId: jest.fn(),
    getstartedWithBiolabs: jest.fn(),
    getFinancialFees: jest.fn(),
    getFeeds: jest.fn(),
    timelineAnalysis: jest.fn(),
    getCompanySizeQuartly: jest.fn(),
    getResidentCompanySpecificFieldsById: jest.fn(),
    addToSpaceChangeWaitList: jest.fn(),
    getSpaceChangeWaitListByStatusSiteIdAndCompanyId: jest.fn(),
    getSpaceChangeWaitListById: jest.fn(),
    getSpaceChangeWaitlistItems: jest.fn(),
    updateSpaceChangeWaitlistPriorityOrder: jest.fn(),
    updateSpaceChangeWaitlist: jest.fn(),
    updateSpaceChangeWaitlistStatus: jest.fn(),
    updateNote: jest.fn()
});

const mockResidentCompany = {
    "createdBy": 1,
    "notes": "this is note2",
    "residentCompany": {
        "id": 1,
        "email": "ipsen@mailinator.com",
        "name": "Ipsen",
        "companyName": "ipsenTest",
        "site": [2],
        "biolabsSources": 2,
        "otherBiolabsSources": "",
        "technology": "Briefly summarize your technol",
        "rAndDPath": "erwsdfersgdfersdgf",
        "startDate": 1625011200,
        "companySize": 25,
        "foundedPlace": "rwedwESDZR",
        "companyStage": 2,
        "otherCompanyStage": "",
        "funding": "12", "fundingSource": [2, 7],
        "otherFundingSource": "",
        "intellectualProperty": 2,
        "otherIntellectualProperty": "",
        "isAffiliated": true,
        "affiliatedInstitution": "rterfgwergder",
        "noOfFullEmp": 13, "empExpect12Months": 13, "utilizeLab": 13, "expect12MonthsUtilizeLab": 13,
        "industry": ['94,95, 96, 97'], "otherIndustries": {},
        "modality": ['6, 7, 8,9, 10, 11'],
        "otherModality": {},
        "preferredMoveIn": 4,
        "status": "1",
        "companyStatus": "1",
        "companyVisibility": false,
        "companyOnboardingStatus": true,
        "elevatorPitch": null,
        "logoOnWall": null,
        "logoOnLicensedSpace": null,
        "bioLabsAssistanceNeeded": null,
        "technologyPapersPublished": null,
        "technologyPapersPublishedLinkCount": null,
        "technologyPapersPublishedLink": null,
        "patentsFiledGranted": null,
        "patentsFiledGrantedDetails": null,
        "foundersBusinessIndustryBefore": null,
        "academiaPartnerships": null,
        "academiaPartnershipDetails": null,
        "industryPartnerships": null,
        "industryPartnershipsDetails": null,
        "newsletters": null,
        "shareYourProfile": null,
        "equipmentOnsite": "restdfearstdfawersd",
        "website": null,
        "foundersBusinessIndustryName": null,
        "createdAt": "2021-07-06T11:29:32.691Z",
        "updatedAt": "2021-07-09T09:14:01.411Z",
        "pitchdeck": null,
        "logoImgUrl": null,
        "committeeStatus": null,
        "selectionDate": "2021-07-05T18:30:00.000Z",
        "companyStatusChangeDate": "2021-07-06T11:31:28.651Z"
    },
    "id": 1,
    "createdAt": "2021-07-12T15:16:19.374Z",
    "notesStatus": 1
}

const req: any = {
    user: { site_id: [1, 2], role: 1, companyId: 70 },
    headers: { 'x-site-id': [2] }
}
let siteIdArr: any;
let site_id: any;
describe('ResidentCompanyController', () => {

    let residentController;
    let residentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule,],
            controllers: [ResidentCompanyController],
            providers: [Mail,
                { provide: ResidentCompanyService, useFactory: mockResidentService },
            ]
        }).compile();
        residentController = await module.get<ResidentCompanyController>(ResidentCompanyController);
        residentService = await module.get<ResidentCompanyService>(ResidentCompanyService);

    });

    it('should be defined', () => {
        expect(residentController).toBeDefined();
    });
    describe('should test addResidentCompany Functionality', () => {

        let mockResidentCompanyPayload: AddResidentCompanyPayload = {
            "email": "newvision@gmail.com", "name": "New Vision", "companyName": "NewVisionTest",
            "site": [1], "biolabsSources": 4, "otherBiolabsSources": "", "technology": "wrsdfcersdgsfd",
            "rAndDPath": "r R&D path & commerciali", "startDate": 1625097600,
            "foundedPlace": "etsfgve", "companyStage": 4, "otherCompanyStage": "", "funding": "12", "fundingSource": [2, 7],
            "otherFundingSource": "", "intellectualProperty": 3,
            "otherIntellectualProperty": "", "isAffiliated": false, "affiliatedInstitution": "",
            "noOfFullEmp": 13, "empExpect12Months": 13, "utilizeLab": 13, "expect12MonthsUtilizeLab": 13,
            "industry": ['94,95, 96, 97'], "otherIndustries": {},
            "modality": ['6, 7, 8,9, 10, 11'],
            "otherModality": {},
            "preferredMoveIn": 4,
            "equipmentOnsite": "TestNew",
            "primarySite":[1],"sitesApplied":[2],"selectionDate":new Date("2021-07-14")
        };

        it('it should called residentService addResidentCompany method ', async () => {
            const pal = { ...mockResidentCompanyPayload, status: "1" };
            //before passing mockResidentCompanyPayload data should check
            expect(mockResidentCompanyPayload).not.toBe(null);
            await residentController.addResidentCompany(mockResidentCompanyPayload, req);
            expect(await residentService.addResidentCompany).toHaveBeenCalledWith(pal, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.addResidentCompany.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.addResidentCompany();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if we pass same email', async () => {
            residentService.addResidentCompany.mockRejectedValueOnce(new NotAcceptableException('User with provided email already created.'));
            try {
                await residentController.addResidentCompany(mockResidentCompanyPayload, req);
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');
            }
        });
    });
    describe('should test getResidentCompanies Functionality', () => {
        const mockparams: any = {};
        it('it should called residentService getResidentCompanies method ', async () => {
            await residentController.getResidentCompanies(mockparams, req);
            siteIdArr = req.user.site_id;
            siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            expect(await residentService.getResidentCompanies).toHaveBeenCalledWith(mockparams, siteIdArr);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getResidentCompanies.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getResidentCompanies(mockparams, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test updateResidentCompanyStatus Functionality', () => {
        const mockUpdateResidentCompanyStatusPayload: UpdateResidentCompanyStatusPayload = {
            "companyId": 3,
            "companyStatus": "1",
            "companyVisibility": true,
            "companyOnboardingStatus": true,
            "committeeStatus": "2",
            "selectionDate": new Date("2021-07-14"),
            "companyStatusChangeDate": new Date("2021-07-14"),
            "companyOnboardingDate": new Date()
        };
        it('it should called residentService updateResidentCompanyStatus method ', async () => {
            await residentController.updateResidentCompanyStatus(mockUpdateResidentCompanyStatusPayload);
            if (mockUpdateResidentCompanyStatusPayload.companyStatusChangeDate) {
                mockUpdateResidentCompanyStatusPayload.companyStatusChangeDate = new Date();
            }
            expect(await residentService.updateResidentCompanyStatus).toHaveBeenCalledWith(mockUpdateResidentCompanyStatusPayload);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateResidentCompanyStatus.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateResidentCompanyStatus(mockUpdateResidentCompanyStatusPayload);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test updateResidentCompany Functionality', () => {
        const mockupdateResidentCompany: UpdateResidentCompanyPayload = {
            "id": 1, "email": "newvision@gmail.com", "name": "New Vision", "companyName": "NewVisionTest",
            "site": [1], "biolabsSources": 4, "otherBiolabsSources": "", "technology": "wrsdfcersdgsfd",
            "rAndDPath": "r R&D path & commerciali", "startDate": 1625097600,
            "foundedPlace": "etsfgve", "companyStage": 4, "otherCompanyStage": "", "funding": "12", "fundingSource": [2, 7],
            "otherFundingSource": "", "intellectualProperty": 3,
            "otherIntellectualProperty": "", "isAffiliated": false, "affiliatedInstitution": "",
            "noOfFullEmp": 13, "empExpect12Months": 13, "utilizeLab": 13, "expect12MonthsUtilizeLab": 13,
            "industry": ['94,95, 96, 97'], "otherIndustries": {}, "modality": ['6, 7, 8,9, 10, 11'],
            "otherModality": {}, "preferredMoveIn": 4, "equipmentOnsite": "TestNew", "elevatorPitch": "string",
            "companySize": 20, "logoOnWall": true, "logoOnLicensedSpace": true, "bioLabsAssistanceNeeded": "string",
            "technologyPapersPublished": true, "technologyPapersPublishedLinkCount": 0, "technologyPapersPublishedLink": "string",
            "patentsFiledGranted": true, "patentsFiledGrantedDetails": "newvision", "foundersBusinessIndustryBefore": true,
            "academiaPartnerships": true, "academiaPartnershipDetails": "ersdf", "industryPartnerships": true,
            "industryPartnershipsDetails": "string", "newsletters": true, "shareYourProfile": true,
            "website": "string", "companyMembers": [], "companyAdvisors": [],
            "companyTechnicalTeams": [], "foundersBusinessIndustryName": "TestNV",
            "primarySite":[1],"sitesApplied":[2]

        };
        it('it should call residentService updateResidentCompany method ', async () => {
            await residentController.updateResidentCompany(mockupdateResidentCompany, req);
            expect(await residentService.updateResidentCompany).toHaveBeenCalledWith(mockupdateResidentCompany, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateResidentCompany.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateResidentCompany(mockupdateResidentCompany, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test gloabalSearchCompanies Functionality', () => {
        const mockSearchResidentCompany: SearchResidentCompanyPayload = {
            q: "test", role: 1, pagination: true, page: 10, limit: 6, companyStatus: '1',
            companyVisibility: true, companyOnboardingStatus: true, siteIdArr: [1, 2],
            industries: [1, 2, 3], modalities: [2, 3, 4], fundingSource: [1, 2, 3,], minFund: 12,
            maxFund: 20, minCompanySize: 10, maxCompanySize: 200, sort: true,
            sortFiled: "test", sortOrder: "ASC", memberShip: 1
        };
        it('it should called residentService gloabalSearchCompanies method ', async () => {
            await residentController.gloabalSearchCompanies(mockSearchResidentCompany, req);
            siteIdArr = req.user.site_id;
            siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            expect(await residentService.gloabalSearchCompanies).toHaveBeenCalledWith(mockSearchResidentCompany, siteIdArr);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.gloabalSearchCompanies.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.gloabalSearchCompanies(mockSearchResidentCompany, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getResidentCompanyForSponsor Functionality', () => {
        it('it should called residentService getResidentCompanyForSponsor method ', async () => {
            await residentController.getResidentCompanyForSponsor();
            expect(await residentService.getResidentCompanyForSponsor).toHaveBeenCalled();
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getResidentCompanyForSponsor.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getResidentCompanyForSponsor();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });

    describe('should test getResidentCompany Functionality', () => {
        it('it should called residentService getResidentCompany method ', async () => {
            await residentController.getResidentCompany(mockResidentCompany.residentCompany.id, req);
            expect(await residentService.getResidentCompany).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getResidentCompany.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getResidentCompany(mockResidentCompany.residentCompany.id, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if we pass same comapny id', async () => {
            residentService.getResidentCompany.mockRejectedValueOnce(new NotAcceptableException('Company with provided id not available.'));
            try {
                await residentController.getResidentCompany(mockResidentCompany.residentCompany.id, req);
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('Company with provided id not available.');
            }
        });
    });

    describe('should test addNotes Functionality', () => {
        let mockAddNote = { "companyId": 3, "notes": "this is note 1" };
        it('it should called residentService addNote method ', async () => {
            expect(mockAddNote).not.toBe(null);
            await residentController.addNote(mockAddNote, req);
            expect(await residentService.addNote).toHaveBeenCalledWith(mockAddNote, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.addNote.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.addNote();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test updateNote Functionality', () => {
        let payload: UpdateNotesDto = { "notes": "this is note 1" };
        it('it should called residentService updateNote method ', async () => {
            expect(payload).not.toBe(null);
            await residentController.updateNote(payload, 1);
            expect(await residentService.updateNote).toHaveBeenCalledWith(payload, 1);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateNote.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateNote(payload, 1)
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getNoteByCompanyId Functionality', () => {
        let mockAddNote = { "companyId": 1, "notes": "this is note 1" };
        it('it should called residentService getNoteByCompanyId method ', async () => {
            expect(mockAddNote).not.toBe(null);

            await residentController.getNoteByCompanyId(mockResidentCompany.residentCompany.id);
            expect(await residentService.getNoteByCompanyId).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getNoteByCompanyId.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getNoteByCompanyId();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });

    describe('should test softDeleteNote Functionality', () => {
        let mockAddNote = { "companyId": 1, "notes": "this is note 1" };
        it('it should called residentService softDeleteNote method ', async () => {
            expect(mockAddNote).not.toBe(null);
            await residentController.softDeleteNote(mockResidentCompany.id);
            expect(await residentService.softDeleteNote).toHaveBeenCalledWith(mockResidentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.softDeleteNote.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.softDeleteNote();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if we pass same  Note id', async () => {
            residentService.softDeleteNote.mockRejectedValueOnce(new NotAcceptableException('Note with provided id not available.'));
            try {
                await residentController.softDeleteNote();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('Note with provided id not available.');
            }
        });
    });
    describe('should test softDeleteMember Functionality', () => {
        let mockType: String = "Advisors";
        it('it should called residentService softDeleteMember method ', async () => {
            await residentController.softDeleteMember(mockResidentCompany.residentCompany.id, mockType);
            expect(await residentService.softDeleteMember).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id, mockType);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.softDeleteMember.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.softDeleteMember();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if we pass same Member  id not available.', async () => {
            residentService.softDeleteMember.mockRejectedValueOnce(new NotAcceptableException('Member with provided id not available.'));
            try {
                await residentController.softDeleteMember();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('Member with provided id not available.');
            }
        });
    });

    describe('should test getStageOfTechnology Functionality', () => {
        it('it should called residentService getStagesOfTechnologyBySiteId method ', async () => {
            await residentController.getStageOfTechnology(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
            expect(await residentService.getStagesOfTechnologyBySiteId).toHaveBeenCalledWith(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getStagesOfTechnologyBySiteId.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getStageOfTechnology();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getFundingBySiteIdAndCompanyId Functionality', () => {
        it('it should called residentService getFundingBySiteIdAndCompanyId method ', async () => {
            await residentController.getFundingBySiteIdAndCompanyId(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
            expect(await residentService.getFundingBySiteIdAndCompanyId).toHaveBeenCalledWith(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getFundingBySiteIdAndCompanyId.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getFundingBySiteIdAndCompanyId();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getstartedWithBiolabs Functionality', () => {
        it('it should called residentService getstartedWithBiolabs method ', async () => {
            await residentController.getstartedWithBiolabs(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
            expect(await residentService.getstartedWithBiolabs).toHaveBeenCalledWith(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getstartedWithBiolabs.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getstartedWithBiolabs();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getFinancialFees Functionality', () => {
        it('it should called residentService getFinancialFees method ', async () => {
            await residentController.getFinancialFees(mockResidentCompany.residentCompany.id);
            expect(await residentService.getFinancialFees).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getFinancialFees.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getFinancialFees();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getFeeds Functionality', () => {
        it('it should called residentService getstartedWithBiolabs method ', async () => {
            await residentController.getFeeds(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
            expect(await residentService.getFeeds).toHaveBeenCalledWith(mockResidentCompany.residentCompany.site, mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getFeeds.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getFeeds();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getTimelineAnalysis Functionality', () => {
        it('it should called residentService timelineAnalysis method ', async () => {
            await residentController.getTimelineAnalysis(mockResidentCompany.residentCompany.id);
            expect(await residentService.timelineAnalysis).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.timelineAnalysis.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getTimelineAnalysis();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getCompanySizeQuartly Functionality', () => {
        it('it should called residentService timelineAnalysis method ', async () => {
            await residentController.getCompanySizeQuartly(mockResidentCompany.residentCompany.id);
            expect(await residentService.getCompanySizeQuartly).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getCompanySizeQuartly.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getCompanySizeQuartly();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getResidentCompanySpecificFieldsById Functionality', () => {
        it('it should called residentService getResidentCompanySpecificFieldsById method ', async () => {
            await residentController.getResidentCompanySpecificFieldsById(mockResidentCompany.residentCompany.id, req);
            expect(await residentService.getResidentCompanySpecificFieldsById).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getResidentCompanySpecificFieldsById.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getResidentCompanySpecificFieldsById();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test addSpaceChangeWaitlist Functionality', () => {
        const mockAddSpaceChangeWaitlistDto = {
            requestStatus: 0,
            isRequestInternal: true,
            membershipChange: 0,
            desiredStartDate: 1627603200,
            items: [
                {
                    itemName: 'Private Office',
                    currentQty: null,
                    productTypeId: 4,
                    desiredQty: 12
                },
                {
                    itemName: 'Workstation',
                    currentQty: null,
                    productTypeId: 3,
                    desiredQty: 12
                },
                {
                    itemName: 'Private Lab',
                    currentQty: null,
                    productTypeId: 5,
                    desiredQty: 20
                },
                {
                    itemName: 'Lab Bench',
                    currentQty: null,
                    productTypeId: 2,
                    desiredQty: 10
                },
                {
                    itemName: 'Membership Fee',
                    currentQty: null,
                    productTypeId: 1,
                    desiredQty: 32
                },
                {
                    itemName: 'TestProduct',
                    currentQty: null,
                    productTypeId: 8,
                    desiredQty: 11
                }
            ],
            requestNotes: 'This is notes1',
            planChangeSummary: '',
            fulfilledOn: 946665000,
            siteNotes: '',
            residentCompanyId: '1',
            companyStage: 3,
            companySize: 120,
            funding: 12,
            fundingSource: [1, 2],
            internalNotes: '',
            shareYourProfile: false,
            requestGraduateDate: 946665000,
            marketPlace: true,
            graduateDescription: 'TEST Graduate Description'
        }

        it('it should called residentService addToSpaceChangeWaitList method ', async () => {
            await residentController.addSpaceChangeWaitlist(mockAddSpaceChangeWaitlistDto, req);
            let siteIdArr = req.user.site_id;
            if (req.headers['x-site-id']) {
                siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            }
            expect(await residentService.addToSpaceChangeWaitList).toHaveBeenCalledWith(mockAddSpaceChangeWaitlistDto, siteIdArr, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.addToSpaceChangeWaitList.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.addSpaceChangeWaitlist(mockAddSpaceChangeWaitlistDto, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getSpaceChangeWaitlist Functionality', () => {
        let status: number[] = [0, 1, 2];
        it('it should called residentService getResidentCompanySpecificFieldsById method ', async () => {
            await residentController.getSpaceChangeWaitlist(status, req, mockResidentCompany.residentCompany.id);
            let siteIdArr = req.user.site_id;
            if (req.headers['x-site-id']) {
                siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            }
            expect(await residentService.getSpaceChangeWaitListByStatusSiteIdAndCompanyId).toHaveBeenCalledWith(status, siteIdArr, mockResidentCompany.residentCompany.id, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getSpaceChangeWaitListByStatusSiteIdAndCompanyId.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getSpaceChangeWaitlist(status, req, mockResidentCompany.residentCompany.id);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test getSpaceChangeWaitlistById Functionality', () => {
        const spaceChangeWaitlistId = 1;
        it('it should called residentService getSpaceChangeWaitlistById method ', async () => {
            await residentController.getSpaceChangeWaitlistById(spaceChangeWaitlistId);
            expect(await residentService.getSpaceChangeWaitListById).toHaveBeenCalledWith(spaceChangeWaitlistId);
        });
        // it('it should throw UnAuthorized Exception if user is not authorized', async () => {
        //     residentService.getSpaceChangeWaitlistById.mockResolvedValue(new UnauthorizedException());
        //     const { response } = await residentController.getSpaceChangeWaitListById(spaceChangeWaitlistId);
        //     expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        //     expect(response.message).toBe('Unauthorized');
        // });
    });
    describe('should test getItemsForSpaceChangeWaitlist Functionality', () => {
        it('it should called residentService getSpaceChangeWaitlistItems method ', async () => {
            await residentController.getItemsForSpaceChangeWaitlist(mockResidentCompany.residentCompany.id, req);
            expect(await residentService.getSpaceChangeWaitlistItems).toHaveBeenCalledWith(mockResidentCompany.residentCompany.id, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.getSpaceChangeWaitlistItems.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.getItemsForSpaceChangeWaitlist();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test updateWaitlistPriorityOrder Functionality', () => {
        let payload: UpdateWaitlistPriorityOrderDto = {
            spaceChangeWaitlistIds: [
                1, 2, 3
            ]
        }
        it('it should called residentService updateSpaceChangeWaitlistPriorityOrder method ', async () => {
            await residentController.updateWaitlistPriorityOrder(payload);
            expect(await residentService.updateSpaceChangeWaitlistPriorityOrder).toHaveBeenCalledWith(payload);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateSpaceChangeWaitlistPriorityOrder.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateWaitlistPriorityOrder(payload);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });

    describe('should test updateSpaceChangeWaitlist Functionality', () => {
        let payload: UpdateSpaceChangeWaitlistDto = {
            spaceChangeWaitlistId: 1,
            requestStatus: 0,
            isRequestInternal: true,
            membershipChange: 0,
            desiredStartDate: 1627603200,
            graduateDescription: 'Test Graduate Description',
            items: [
                {
                    itemName: 'Private Office',
                    currentQty: 12,
                    productTypeId: 4,
                    desiredQty: 12
                },
                {
                    itemName: 'Workstation',
                    currentQty: 7,
                    productTypeId: 3,
                    desiredQty: 12
                },
                {
                    itemName: 'Private Lab',
                    currentQty: 8,
                    productTypeId: 5,
                    desiredQty: 20
                },

                {
                    itemName: 'Membership Fee',
                    currentQty: 10,
                    productTypeId: 1,
                    desiredQty: 32
                },

            ],
            planChangeSummary: "See Notes",
            fulfilledOn: 0,
            requestNotes: 'This is notes1',
            funding: '12',
            siteNotes: '', companyStage: 3,
            companySize: 120,
            fundingSource: [1, 2],
            internalNotes: '',
            shareYourProfile: false,
            requestGraduateDate: 946665000,
            marketPlace: true,
        }
        it('it should called residentService updateSpaceChangeWaitlistPriorityOrder method ', async () => {
            await residentController.updateSpaceChangeWaitlist(payload, req);
            let siteIdArr = req.user.site_id;
            if (req.headers['x-site-id']) {
                siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            }
            expect(await residentService.updateSpaceChangeWaitlist).toHaveBeenCalledWith(payload, siteIdArr, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateSpaceChangeWaitlist.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateSpaceChangeWaitlist(payload, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test updateSpaceChangeWaitlistStatus Functionality', () => {
        let payload: UpdateWaitlistRequestStatusDto = {
            id: 1,
            status: 1
        }
        it('it should called residentService updateSpaceChangeWaitlistStatus method ', async () => {
            await residentController.updateSpaceChangeWaitlistStatus(payload, req);
            expect(await residentService.updateSpaceChangeWaitlistStatus).toHaveBeenCalledWith(payload, req);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            residentService.updateSpaceChangeWaitlistStatus.mockResolvedValue(new UnauthorizedException());
            const { response } = await residentController.updateSpaceChangeWaitlistStatus(payload, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
});