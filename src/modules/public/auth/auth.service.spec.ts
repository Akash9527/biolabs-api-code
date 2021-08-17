import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user';
import { UsersService } from '../user/user.service'
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MasterService } from '../master';
import { ResidentCompany, ResidentCompanyService } from '../resident-company';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config';
import { Hash } from '../../../utils/Hash';
import { HTTP_CODES } from '../../../utils/httpcode';
import { SUPER_ADMIN_ACCESSLEVELS } from '../../../constants/privileges-super-admin';
import { SITE_ADMIN_ACCESSLEVELS } from '../../../constants/privileges-site-admin';
import { SPONSOR_ACCESSLEVELS } from '../../../constants/privileges-sponsor';
import { RESIDENT_ACCESSLEVELS } from '../../../constants/privileges-resident';
import { DatabaseService } from '../master/db-script.service';
const mockUser: User = {
    id: 1,
    role: 1,
    site_id: [1, 2],
    companyId: 1,
    email: "superadmin@biolabs.io",
    firstName: "adminName",
    lastName: "userLast",
    title: "SuperAdmin",
    phoneNumber: "",
    status: '1',
    imageUrl: "",
    userType: '1',
    password: "Admin",
    createdAt: 12,
    updatedAt: 12,
    toJSON: null,
    isRequestedMails:null,
    mailsRequestType:null
}
const mockRC: ResidentCompany = {
    id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
    technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
    otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
    otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
    utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
    preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20,
    "companyStatus": "1",
    "companyVisibility": true,
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
    "shareYourProfile": false,
    "website": null,
    "foundersBusinessIndustryName": null,
    "createdAt": 2021,
    "updatedAt": 2021,
    "pitchdeck": "pitchDeck.img",
    "logoImgUrl": "logoimgurl.img",
    "committeeStatus": null,
    "selectionDate": new Date("2021-07-05T18:30:00.000Z"),
    "companyStatusChangeDate": 2021,
  }
const mockUserService = () => ({
    getByEmail: jest.fn(),
    validateToken: jest.fn(),
    forgotPassword: jest.fn(),
    create:jest.fn(),
    get:jest.fn()
})

const mockConfigService = () => { }

const mockdatabaseService = () => { }

const mockJwtService = () => ({
    sign: jest.fn(),
    decode: jest.fn()
})
const mockMasterService = () => ({
    createRoles:jest.fn(),
    createSites:jest.fn(),
    createFundings:jest.fn(),
    createModalities:jest.fn(),
    createBiolabsSources:jest.fn(),
    createCategories:jest.fn(),
    createTechnologyStages:jest.fn(),
    createProductType:jest.fn(),
    readMigrationJson:jest.fn()
});
const mockResidentCompanyService = () => ({
    getResidentCompany: jest.fn()
})
let req: Request;
// const appRoot = require('app-root-path');
// const migrationData = JSON.parse(require("fs").readFileSync(appRoot.path + "/" + process.env.BIOLAB_CONFIGURATION_JSON));
describe('AuthService', () => {
    let authService;
    let usersService;
    let jwtService;
    let residentCompanyService;
    let masterService;
    let databaseService;


    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useFactory: mockUserService },
                { provide: JwtService, useFactory: mockJwtService },
                { provide: MasterService, useFactory: mockMasterService },
                { provide: ResidentCompanyService, useFactory: mockResidentCompanyService },
                { provide: ConfigService, useFactory: mockConfigService },
                { provide: DatabaseService, useFactory: mockdatabaseService }
            ]
        }).compile();

        authService = await module.get<AuthService>(AuthService);
        masterService = await module.get<MasterService>(MasterService);
        usersService = await module.get<UsersService>(UsersService);
        jwtService = await module.get<JwtService>(JwtService);
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
        databaseService = await module.get<DatabaseService>(DatabaseService);
    });
    it('should be defined', () => {
        expect(authService).toBeDefined();
    });
    // describe('should test onApplicationBootstrap functionality', () => {
    //     let mockSuperAdmin='superadmin@biolabs.io';
    //     it('should be called masterService method', async () => {
    //         await authService.onApplicationBootstrap();
    //         const fileData = await masterService.readMigrationJson();
    //         expect(await masterService.createRoles).toHaveBeenCalledWith(fileData);
    //         expect(await masterService.createSites).toHaveBeenCalledWith(fileData);
    //         expect(await masterService.createFundings).toHaveBeenCalledWith(fileData);
    //         expect(await masterService.createModalities).toHaveBeenCalledWith(fileData);
    //         expect(await masterService.createBiolabsSources).toHaveBeenCalledWith(fileData);
    //         expect(await masterService.createCategories).toHaveBeenCalledWith(fileData);
    //         jest.spyOn(usersService,'getByEmail').mockResolvedValueOnce(mockSuperAdmin);
    //         // // jest.spyOn(usersService,'create').mockResolvedValueOnce('superadmin@biolabs.io');
    //         // //await usersService.getByEmail.mockResolvedValue('superadmin@biolabs.io');
    //         mockSuperAdmin="testadmin";
    //         if (!mockSuperAdmin) {
    //              jest.spyOn(usersService,'create').mockResolvedValueOnce('superadmin@biolabs.io');
    //           }
    //     });
    // });
    // describe('should test createSuperAdmin functionality', () => {
    //     it('should be called userService getByEmail method', async () => {
    //         await authService.onApplicationBootstrap();
    //         expect(await usersService.getByEmail).toHaveBeenCalledWith('superadmin@biolabs.io');
    //     });
    //     it('should validate createAdmin method', async () => {
    //         usersService.getByEmail.mockResolvedValue('superadmin@biolabs.io');
    //         const superAdmin=await authService.createSuperAdmin();
    //         if (!superAdmin) {
    //             await usersService.create(migrationData['superadmin']);
    //           }
    //         expect(superAdmin).not.toBeNull();
    //     });
    // });
    describe('should test  validate user functionality', () => {
        const mockLoginPayLoad = { email: 'superadmin@biolabs.io', password: 'Admin' };

        it('should be called userService getByEmail method', async () => {
            authService.validateUser(mockLoginPayLoad);
            expect(await usersService.getByEmail).toHaveBeenCalledWith(mockLoginPayLoad.email);

        });
        it('should validate user', async () => {
            const hashCompareStatic = jest.fn().mockReturnValue(true);
            Hash.compare = hashCompareStatic;
            usersService.getByEmail.mockResolvedValue(mockUser);
            Hash.compare('payload password', 'user password');
            expect(await authService.validateUser(mockLoginPayLoad)).toMatchObject(mockUser);
            expect(Hash.compare).toHaveBeenCalledWith('payload password', 'user password');
        });
        it('should validate user and check companyId is present', async () => {
            usersService.getByEmail.mockResolvedValue(mockUser);
            let user: User = await authService.validateUser(mockLoginPayLoad);
            expect(user.companyId).toBe(mockUser.companyId);
            expect(await residentCompanyService.getResidentCompany).toHaveBeenCalledWith(user.companyId, null);
        });
        it('should not validate invalid user', async () => {
            const hashCompareStatic = jest.fn().mockReturnValue(false);
            Hash.compare = hashCompareStatic;
            usersService.getByEmail.mockResolvedValue(mockUser);
            Hash.compare('payload password', 'user password');
            try {
                await authService.validateUser(mockLoginPayLoad);
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
                expect(e.response.error).toBe('Unauthorized');
            }
        });
    });
    describe('should test  validate Token functionality', () => {
        const mockTokenString = "tokenString";
        it('should be called userservice validateToken method', async () => {
            authService.validateToken(mockTokenString);
            expect(await usersService.validateToken).toHaveBeenCalledWith(mockTokenString);
        });
        it('it should be  validate Token', async () => {
            await usersService.validateToken.mockResolvedValueOnce(mockTokenString);
            expect(await authService.validateToken()).toBe(mockTokenString);

        });
        it('it should not be validate invalid token  ', async () => {
            usersService.validateToken.mockResolvedValue(new NotAcceptableException('Token is Invalid'));
            try {
                await authService.validateToken();
            } catch (e) {

                expect(e.response.message).toBe('Not Acceptable');
                expect(e.message).toBe('Token is Invalid');
            }
        });

    });

    describe('should test forgotPassword functionality ', () => {
        const mockForgotPasswordPayload = { email: "superadmin@biolabs.io" };
        it('it should call userService forgotPassword method', async () => {
            //check function is called or not
            await authService.forgotPassword(mockForgotPasswordPayload, req);
            expect(await usersService.forgotPassword).toHaveBeenCalledWith(mockForgotPasswordPayload, req);
        });
        it('it should test forgotPassword ', async () => {
            await usersService.forgotPassword.mockReturnValueOnce(true);
            let result = await authService.forgotPassword();
            expect(result).toBeTruthy;
        });
        it('it should throw exception ', async () => {
            await usersService.forgotPassword.mockRejectedValueOnce(new NotAcceptableException('User with provided email already created.'));
            try {
                await authService.forgotPassword();
            } catch (e) {
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');

            }

        });
    });
    describe('create token', () => {
        it('should create token for valid role', () => {
            jwtService.sign.mockReturnValue(true);
            let outcome = authService.createToken(mockUser);
            let permissions = outcome.permissions;
            switch (permissions.role) {
                case 1:
                  permissions = SUPER_ADMIN_ACCESSLEVELS;
                  break;
                case 2:
                  permissions = SITE_ADMIN_ACCESSLEVELS;
                  break;
                case 3:
                  permissions = SPONSOR_ACCESSLEVELS;
                  break;
                case 4:
                  permissions = RESIDENT_ACCESSLEVELS;
                  break;
                default:
                  break;
            }
            expect(Object.entries(permissions).length).not.toBe(0);
            expect(outcome).toHaveProperty('expiresIn');
            expect(outcome).toHaveProperty('accessToken');
            expect(outcome).toHaveProperty('permissions');
        });

        it('should not create token for invalid role', () => {
            mockUser.role = 401;
            // jwtService.sign.mockReturnValue(true);
            let outcome = authService.createToken(mockUser);
            let permissions = outcome.permissions;
            expect(Object.entries(permissions).length).toBe(0);
        });
    });

    describe('should decode Token functionality', () => {
        const mockTokenPayload = {accessToken:"tokenString"};
        const mockdecodedToken = { id: 1, iat: 1628585535, exp: 1628671935 }
        it('should decode token', async () => {
            await jwtService.decode.mockResolvedValueOnce(mockdecodedToken);
            jest.spyOn(usersService,'get').mockResolvedValue(mockUser);
            jest.spyOn(residentCompanyService,'getResidentCompany').mockResolvedValueOnce(mockRC)
            let outcome = await authService.decodeToken(mockTokenPayload);
            expect(outcome).not.toBeNull();
            expect(outcome).not.toBeUndefined();
            expect(outcome.id).toEqual(mockUser.id);
            expect(outcome.company).toEqual(mockRC);
        });
        it('should validate user and check companyId is present', async () => {
            await jwtService.decode.mockRejectedValueOnce(mockdecodedToken);
            mockUser.status='1';
            jest.spyOn(usersService,'get').mockResolvedValue(null);
                try {
                await authService.decodeToken(mockTokenPayload);
                } catch (e) {
                    expect(e.response.message).toEqual('Invalid token!');
                    expect(e.response.error).toEqual('Unauthorized');
                    expect(e.status).toEqual(401);
                    expect(e instanceof UnauthorizedException).toBeTruthy();
                }
        });
    });
});
