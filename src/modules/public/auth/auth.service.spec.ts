import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user';
import { UsersService } from '../user/user.service'
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MasterService } from '../master';
import { ResidentCompanyService } from '../resident-company';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config';
import { Hash } from '../../../utils/Hash';
import { HTTP_CODES } from '../../../utils/httpcode';
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
}
const mockUserService = () => ({
    getByEmail: jest.fn(),
    validateToken: jest.fn(),
    forgotPassword: jest.fn()
})

const mockConfigService = () => { }
const mockJwtService = () => ({
    sign: jest.fn()
})
const mockMasterService = () => ({})
const mockResidentCompanyService = () => ({
    getResidentCompany: jest.fn()
})
let req: Request;

describe('AuthService', () => {
    let authService;
    let usersService;
    let jwtService;
    let residentCompanyService;


    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useFactory: mockUserService },
                { provide: JwtService, useFactory: mockJwtService },
                { provide: MasterService, useFactory: mockMasterService },
                { provide: ResidentCompanyService, useFactory: mockResidentCompanyService },
                { provide: ConfigService, useFactory: mockConfigService }
            ]
        }).compile();

        authService = await module.get<AuthService>(AuthService);
        usersService = await module.get<UsersService>(UsersService);
        jwtService = await module.get<JwtService>(JwtService);
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
    });
    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

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
            expect(await residentCompanyService.getResidentCompany).toHaveBeenCalledWith(user.companyId);
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
});
