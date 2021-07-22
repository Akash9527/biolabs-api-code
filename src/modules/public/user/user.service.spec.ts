import { Test } from '@nestjs/testing';
import { createQueryBuilder, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '.';
import { User, UserFillableFields } from './user.entity';
import { UserToken } from './user-token.entity';
import { PassportModule } from '@nestjs/passport';
import { Mail } from '../../../utils/Mail';
import { JwtService } from '@nestjs/jwt';
import { ResidentCompanyService } from '../resident-company';
import { NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';
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
const mockJwtService = () => ({
    sign: jest.fn()
})

const mockResidentCompanyService = () => ({
    getResidentCompany: jest.fn()
});
const mockUserFillable: UserFillableFields = {
    email: "testadmin@biolabs.io", password: "test@1234", role: 1, site_id: [1, 2], companyId: 1,
    firstName: "adminName", lastName: "userLast", title: "SuperAdmin", phoneNumber: "2345678902",
    status: '1', userType: '1', imageUrl: "admin.jpg"
}
const mockUserToken = { token: "moke token", userName: "adminName", origin: "req.headers['origin'] " }
var req: Request;
describe('UserService', () => {
    let userService: UsersService;
    let userRepository: Repository<User>;
    let userTokenRepository: Repository<UserToken>;
    let residentCompanyService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
            providers: [
                Mail, UsersService,
                { provide: JwtService, useFactory: mockJwtService },
                { provide: ResidentCompanyService, useFactory: mockResidentCompanyService },
                {
                    provide: getRepositoryToken(User),
                    useValue:
                    {
                        findOne: jest.fn(),
                        create: jest.fn(() => mockUser),
                        save: jest.fn(),
                        createQueryBuilder: jest.fn(() =>
                        ({
                            addSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            setParameter: jest.fn().mockReturnThis(),
                            getOne: jest.fn()
                        })),
                    }
                },
                {
                    provide: getRepositoryToken(UserToken), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(() => mockUser),
                    }
                },

            ]
        }).compile();

        userService = await module.get<UsersService>(UsersService);
        userRepository = await module.get<Repository<User>>(getRepositoryToken(User));
        userTokenRepository = await module.get<Repository<UserToken>>(getRepositoryToken(UserToken));
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);

    });
    it('it should be defined', () => {
        expect(userService).toBeDefined();
    });
    describe('get method', () => {
        it('it should called findOne  method ', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
            expect(await userService.get(mockUser.id)).toEqual(mockUser);
        });
    });
    describe('getByEmail method', () => {
        it('it should called createQueryBuilder  method ', async () => {
            userRepository.createQueryBuilder('users')
                .addSelect("users.email")
                .addSelect("users.password")
                .where('users.email = :email')
                .setParameter('email', mockUserFillable.email)
                .getOne();
            const result = await userService.getByEmail(mockUserFillable.email);
            expect(result).not.toBeNull();
        });
    });
    describe('create method', () => {
        it('should create user if email already not exist', async () => {
            mockUserFillable.email = "admin@gmail.com";
            userRepository.createQueryBuilder('mockUser')
                .addSelect("mockUser.email")
                .addSelect("mockUser.password")
                .where('mockUser.email = :email')
                .setParameter('email', mockUserFillable.email)
                .getOne();
            // jest.spyOn(userRepository, 'create').mockReturnValueOnce(mockUserFillable);
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);
            let ans = await userService.create(mockUserFillable);
            expect(ans).toBe(mockUser);
        })
        it('should not create user if email already exist', async () => {
            jest.spyOn(userService, 'getByEmail').mockRejectedValueOnce(new NotAcceptableException("User with provided email already created."));
            try {
                await userService.create(mockUserFillable);
            } catch (e) {
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.response.message).toBe("User with provided email already created.")
            }
        });
    });
    describe('softDelete method', () => {
        it('should delete data based on id', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);
            const users = await userService.softDeleteUser(mockUser.id);
            expect(users).toBe(mockUser);
        })

        it.skip('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
            try {
                await userService.softDeleteUser(new NotAcceptableException('User with provided id not available.'));
            } catch (e) {
                console.log('error ',e);
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.response.message).toBe('User with provided id not available.');
                expect(e.response.statusCode).toBe(406);
            }
        });
    });
    describe('getUserById method', () => {
        it('should delete data based on id', async () => {
            //get method
            mockUser.status = "1";
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
            // const user: User = await userService.get(mockUser.id);

            // //result should not be null
            // expect(user).not.toBeNull();
            // //check company id is not null or undefined
            // expect(user.companyId).not.toBeNull();
            // expect(user.companyId).not.toBeUndefined();
            let users = await userService.getUserById(mockUser.id);
            expect(users).toBe(mockUser);


        })

        it('it should throw exception if user id is not provided   ', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
            try {
                await userService.getUserById(new NotAcceptableException('User with provided id not available.'));
            } catch (e) {
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.response.message).toBe('User with provided id not available.');
                expect(e.response.statusCode).toBe(406);
            }
        });
    });
});



