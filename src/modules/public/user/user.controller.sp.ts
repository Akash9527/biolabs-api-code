import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from "./user.controller";

describe('AuthService', () => {
  let service: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserController],
    }).compile();

    service = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

/*import { NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { HTTP_CODES } from '../../../utils/httpcode';
import { AddUserPayload } from "./add-user.payload";
import { UpdateUserPayload } from './update-user.payload';
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UsersService } from "./user.service";
import { Request, Response } from 'express';
import { PassportModule } from "@nestjs/passport";
import { ListUserPayload } from "./list-user.payload";

let req: Request;
let res: Response;
let mockUserService = () => ({
    addUser: jest.fn(),
    updateUser: jest.fn(),
    getUsers: jest.fn(),
    softDeleteUser: jest.fn(),
    getUserById: jest.fn(),

});
const mockUser: User = {
    id: 1,
    role: 1,
    site_id: [1, 2],
    companyId: 1,
    email: "testadmin@biolabs.io",
    firstName: "adminName",
    lastName: "userLast",
    title: "SuperAdmin",
    phoneNumber: "2345678902",
    status: '1',
    imageUrl: "",
    userType: '1',
    password: "test@1234",
    createdAt: 12,
    updatedAt: 12,
    toJSON: null
}

describe('UserController', () => {

    let userController;
    let userService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [UserController],
            providers: [
                { provide: UsersService, useFactory: mockUserService },
            ]
        }).compile();

        userController = await module.get<UserController>(UserController);
        userService = await module.get<UsersService>(UsersService);

    });
    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('should test addUser Functionality', () => {
        let mockAddUserPayload: AddUserPayload = {
            email: "testadmin@biolabs.io", role: 1, companyId: 1, site_id: [1], firstName: "adminName", lastName: "userLast",
            imageUrl: "eadzfxdsz", title: "SuperAdmin", phoneNumber: "2345678902", userType: '1',
            password: "test@1234", passwordConfirmation: "test@1234"
        };

        it('it should called userService AddUser method ', async () => {
            const pal = { ...mockAddUserPayload, status: "0" };
            //before passing addUserpayload data should check
            expect(mockAddUserPayload).not.toBe(null);
            //check password and confirmation password same or not
            expect(mockAddUserPayload.password).toStrictEqual(mockAddUserPayload.passwordConfirmation);
            await userController.addUser(mockAddUserPayload, req);
            expect(await userService.addUser).toHaveBeenCalledWith(pal, req);

        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            userService.addUser.mockResolvedValue(new UnauthorizedException());
            const { response } = await userController.addUser();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should return User Information', async () => {
            await userService.addUser.mockResolvedValueOnce(mockUser);
            let user = await userController.addUser(mockAddUserPayload, req);
            expect(user.id).not.toBeNull();
            expect(user.firstName).toEqual(mockAddUserPayload.firstName);
            expect(user.email).toEqual(mockAddUserPayload.email);
            expect(user.password).toEqual(mockAddUserPayload.password);
            expect(user.role).toEqual(mockAddUserPayload.role);
            expect(user.createdAt).not.toBeNull();
        });

        it('it should throw exception if we pass same email', async () => {
            userService.addUser.mockRejectedValueOnce(new NotAcceptableException('User with provided email already created.'));
            try {
                await userController.addUser(mockAddUserPayload, req);
            }
            catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');
            }
        });
    });

    describe('should test updateUser Functionality', () => {
        let mockUpdateUserPayload: UpdateUserPayload = {
            userType: '1', companyId: 1, firstName: "adminName", lastName: "userLast",
            title: "SuperAdmin", phoneNumber: "2345678902", site_id: [1],
            password: "test@1234", passwordConfirmation: "test@1234", id: 1
        };

        it('it should call userService  method', async () => {
            //before passing values check id should not be null
            expect(mockUpdateUserPayload.id).not.toBeNull();
            //check userService function is called or not
            await userController.updateUser(mockUpdateUserPayload);
            expect(await userService.updateUser).toHaveBeenCalledWith(mockUpdateUserPayload);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            userService.updateUser.mockResolvedValue(new UnauthorizedException());
            const { response } = await userController.updateUser();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should update user info and return updated user info', async () => {
            //update values
            mockUser.firstName = mockUpdateUserPayload.firstName;
            mockUser.title = mockUpdateUserPayload.title;
            mockUser.phoneNumber = mockUpdateUserPayload.phoneNumber;
            //return updated users
            userService.updateUser.mockResolvedValue(mockUser);
            let updatedUser = await userController.updateUser();
            //check updated user and new user info
            expect(updatedUser).toBe(mockUser);
        });
        it('it should throw exception if user id is not found', async () => {
            userService.updateUser.mockRejectedValueOnce(new NotAcceptableException(' User with provided id not available.'));
            try {
                await userController.updateUser();
            }
            catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe(' User with provided id not available.');
            }
        });
    });

    // describe('should test getUsers Functionality', () => {
    //     let mockListUserPayload: ListUserPayload = {
    //         q: "test", role: 1, pagination: true, page: 12,
    //         limit: 4, sort: true, sortFiled: "test", sortOrder: "ASC"
    //     };
    //     const mockUser1 = { id: 2, ...mockUser };
    //     const users = { mockUser, mockUser1 }
    //     let userList;
    //     it('it should call userService getUsers  method', async () => {
    //         //check userService softDelete function is called or not
    //         await userController.getUsers(mockListUserPayload);
    //         expect(await userService.getUsers).toHaveBeenCalledWith(mockListUserPayload);
    //     });
    //     it('it should return users ', async () => {
    //         userService.getUsers.mockResolvedValueOnce(users);
    //         userList = await userController.getUsers(mockListUserPayload);
    //         expect(Object.keys(userList).length).toBe(2);
    //         expect(users).toBe(userList);
    //         //check size or count size --TO-Do
    //     });

    //     it('it should return null if user is deactive ', async () => {
    //         //user1 is deactive so it return only one use
    //         mockUser1.status = "99";
    //         userService.getUsers.mockResolvedValueOnce(users.mockUser);
    //         userList = await userController.getUsers(mockListUserPayload);
    //         expect(users.mockUser).toBe(userList);
    //     });
    //     it('it should throw UnAuthorized Exception if user is not authorized', async () => {
    //         userService.getUsers.mockResolvedValue(new UnauthorizedException());
    //         const { response } = await userController.getUsers();
    //         expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    //         expect(response.message).toBe('Unauthorized');
    //     });
    // });
    describe('should test getUserById Functionality', () => {
        it('it should call userService getUserById  method', async () => {
            //check userService softDelete function is called or not
            await userController.getUserById(mockUser.id);
            expect(await userService.getUserById).toHaveBeenCalledWith(mockUser.id);
        });
        it('it should return users based on id', async () => {

            await userService.getUserById.mockResolvedValue(mockUser);
            let users: User = await userController.getUserById(mockUser.id);
            expect(users).toBe(mockUser)
            expect(userService.getUserById).toBeCalledTimes(1);

        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            userService.getUserById.mockResolvedValue(new UnauthorizedException());
            const { response } = await userController.getUserById();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if user id is not found', async () => {
            userService.getUserById.mockRejectedValueOnce(new NotAcceptableException(' User with provided id not available.'));
            try {
                expect(mockUser.id).not.toBe(2);
                await userController.getUserById(2);
            }
            catch (e) {
                expect(e.response.statusCode).toEqual(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe(' User with provided id not available.');
            }
        });
        it('it should throw exception if user id is found but company id is not matched', async () => {
            userService.getUserById.mockRejectedValueOnce(new NotAcceptableException('Company with provided id not available.'));
            try {
                //user id matched
                expect(mockUser.id).toBe(1);
                //company id is not matched
                expect(mockUser.companyId).not.toBe(2);
                await userController.getUserById(1);
            }
            catch (e) {
                expect(e.response.statusCode).toEqual(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('Company with provided id not available.');
            }
        });

    });
    describe('should test softDeleteUser Functionality', () => {
        it('it should call userService softdelete  method', async () => {
            //check userService softDelete function is called or not
            await userController.softDeleteUser(mockUser.id);
            expect(await userService.softDeleteUser).toHaveBeenCalledWith(mockUser.id);
        });
        it('it should delete data(update status to 99)', async () => {
            await userService.softDeleteUser.mockResolvedValue(mockUser);
            let deletedUser: User = await userController.softDeleteUser(mockUser.id);
            //change delete user status to 99
            deletedUser.status = "99";
            expect(deletedUser.status).toBe(mockUser.status);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            userService.softDeleteUser.mockResolvedValue(new UnauthorizedException());
            const { response } = await userController.softDeleteUser();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
        it('it should throw exception if user id is not found', async () => {
            userService.softDeleteUser.mockRejectedValueOnce(new NotAcceptableException(' User with provided id not available.'));
            try {
                await userController.softDeleteUser(2);
                expect(mockUser.id).not.toBe(2);
            }
            catch (e) {
                expect(e.response.statusCode).toBe(HTTP_CODES.NOT_ACCEPTABLE);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe(' User with provided id not available.');
            }
        });
    });
});
*/