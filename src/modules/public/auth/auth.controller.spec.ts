import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service'
import { InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { HTTP_CODES } from '../../../utils/httpcode';
const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0
};
const mockUser: User = {
    id: 1,
    email: "Testadmin@biolabs.io",
    firstName: "admin",
    lastName: "user",
    password: "biolabs.io",
} as User;
const done={null:null ,mockUser};
const mockAuthService = () => ({
    createToken: jest.fn(),
    validateUser: jest.fn(),
    validateToken: jest.fn(),
    forgotPassword: jest.fn()
});
const mockUserService = () => ({
    getByEmail: jest.fn(),
    get: jest.fn(),
    setNewPassword: jest.fn(),
    validateToken: jest.fn()
});

describe('AuthController', () => {

    let authController;
    let authService;
    let userService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useFactory: mockAuthService },
                { provide: UsersService, useFactory: mockUserService },
            ]
        }).compile();
        authController = await module.get<AuthController>(AuthController);
        authService = await module.get<AuthService>(AuthService);
        userService = await module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('test validate user Functionality', () => {
        const mockPayload = { email: 'Testadmin@biolabs.io', password: 'biolabs.io' };

        it('it should call authService validateUser method', async () => {
            //check function is called or not
            await authController.login(mockPayload);
            expect(await authService.validateUser).toHaveBeenCalledWith(mockPayload);
        });
        it('it should check validate User', async () => {
            await authService.createToken.mockReturnValueOnce(mockUser);
            let user = await authController.login(mockPayload);
            expect(user.email).toEqual(mockPayload.email);
            expect(user.password).toEqual(mockPayload.password);

        })
        it('test login request for valid user', async () => {
            authService.validateUser.mockReturnValueOnce(mockUser);
            authService.createToken.mockReturnValueOnce(
                { ...mockUser, expiresIn: "moke date", accessToken: "dummy date", permissions: "dummy permissions" }
            );
            const result = await authController.login();
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('permissions');
            expect(result).toHaveProperty('expiresIn');
        });
        it('test login request with Unauthorized', async () => {
            authService.createToken.mockResolvedValue(new UnauthorizedException());
            const { response } = await authController.login();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('test login request with InternalServerErrorException', async () => {
            authService.validateUser.mockRejectedValueOnce(new InternalServerErrorException());
            try {
                await authController.login();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
                expect(e.response.message).toBe('Internal Server Error');
            }
        });
    });


    describe('test SetPassword Functionality ', () => {

        const mockPasswordPayload = {
            token: "mockToken", password: "biolabsAdmin",
            passwordConfirmation: "biolabsAdmin"
        };
        it('it should call userService setPassword method', async () => {
            //check function is called or not
            await authController.setNewPassword(mockPasswordPayload);
            expect(await userService.setNewPassword).toHaveBeenCalledWith(mockPasswordPayload);
        });
        it('user should set new password', async () => {
            //check password and confirm password same or not
            expect(mockPasswordPayload.password).toBe(mockPasswordPayload.passwordConfirmation);
            //set password return new User
            let newUser: User = userService.setNewPassword.mockResolvedValue(mockUser);
            newUser.password = mockPasswordPayload.password
            await authController.setNewPassword();
            ///check new password and new previos should not match
            expect(newUser.password).not.toEqual(mockUser.password);
        });
        it('user should throw exception', async () => {
            //check if null pass then throw exception
            userService.setNewPassword.mockResolvedValue(new NotAcceptableException('Token is Invalid'));
            try {
                await authController.setNewPassword();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.message).toBe('Not Acceptable');
                expect(e.message).toBe('Token is Invalid');
                // console.log(e.response);
            }
        });
    })
    describe('test verifyLink functionality ', () => {
        const mockTokenString = "tokenString";
        it('it should call authService validateToken method', async () => {
            //check function is called or not
            await authController.verifyLink(mockTokenString);
            expect(await authService.validateToken).toHaveBeenCalledWith(mockTokenString);
        });
        it('it should verifylink', async () => {
            await authService.validateToken.mockReturnValueOnce(mockTokenString);
            let result = await authController.verifyLink(mockTokenString);
            expect(result).toBe(mockTokenString);

        });
        it('it throws error if link is not verified', async () => {
            //check if null pass then throw exception
            authService.validateToken.mockResolvedValue(new NotAcceptableException("Token is invalid."));
            try {
                await authController.verifyLink();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('Token is invalid.');
            }
        });
    });
    describe('test  forgotPassword functionality ', () => {
        const mockForgotPasswordPayload = { email: "Testadmin@biolabs.io" };
        let req: Request;
        it('it should call authService forgotPassword method', async () => {
            //check function is called or not
            await authController.forgotPassword(mockForgotPasswordPayload, req);
            expect(await authService.forgotPassword).toHaveBeenCalledWith(mockForgotPasswordPayload, req);
        });
        it('it should test forgotPassword ', async () => {
            await authService.forgotPassword.mockReturnValueOnce(true);
            let result = await authController.forgotPassword();
            expect(result).toBeTruthy;
        });
        it('it should throw exception ', async () => {
            await authService.forgotPassword.mockRejectedValueOnce(new NotAcceptableException('User with provided email already created.'));
            try {
                await authController.forgotPassword();
            } catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');

            }

        });
    });

});
