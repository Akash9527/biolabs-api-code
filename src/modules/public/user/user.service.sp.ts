/*import { NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Mail } from '../../../utils/Mail';
import { ResidentCompanyService } from '../resident-company/resident-company.service';
import { UserToken } from './user-token.entity';
import { User, UserFillableFields } from './user.entity';
import { UsersService } from './user.service';
const mockJwtService = () => ({
    sign: jest.fn()
})
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
const mockUserToken: UserToken = {
    id: 1, user_id: 1, token: "mockTokenString", status: "1", createdAt: 12,
    updatedAt: 12,
}
const mockResidentCompanyService = () => ({})
const mockUserRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(() => mockUser),
    createQueryBuilder: jest.fn(() => ({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(mockUser),
    })),
});
const mockUserService = () => ({
    get: jest.fn(() => mockUser),
    getByEmail: jest.fn(() => mockUser),
    generateToken: jest.fn(() => mockUserToken),
    create: jest.fn(() => mockUser),
    addUser: jest.fn(),

});
const mockUserTokenRepository = () => ({
    findOne: jest.fn(),
    delete: jest.fn(),
});
const mockUserFillable: UserFillableFields = {
    email: "testadmin@biolabs.io", password: "test@1234", role: 1, site_id: [1, 2], companyId: 1,
    firstName: "adminName", lastName: "userLast", title: "SuperAdmin", phoneNumber: "2345678902",
    status: '1', userType: '1', imageUrl: "admin.jpg"
}
const mockToken = { token: "moke token", userName: "adminName", origin: "req.headers['origin'] " }
var req: Request;
describe('UsersService', () => {
    let userService:UsersService;
    let repo: Repository<User>;
    let repoToken: Repository<UserToken>;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
            providers: [
                Mail,
                { provide: UsersService, useFactory: mockUserService },
                { provide: JwtService, useFactory: mockJwtService },
                { provide: ResidentCompanyService, useFactory: mockResidentCompanyService },
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(UserToken),
                    // as a class value, Repository needs no generics
                    useClass: Repository,
                }
            ]
        }).compile();

        userService = await module.get<UsersService>(UsersService);
        // Save the instance of the repository and set the correct generics
        repo = module.get(getRepositoryToken(User));
        repoToken = module.get(getRepositoryToken(UserToken));
    });
    it('should be defined', () => {
        expect(userService).toBeDefined();
    });
    describe('get method', () => {
        it('it should called findOne  method ', async () => {
            jest.spyOn(repo, 'findOne').mockResolvedValueOnce(mockUser);
            expect(await userService.get(mockUser.id)).toEqual(mockUser);
        });
    });
    describe('getByEmail method', () => {
        it('it should called createQueryBuilder  method ', async () => {
            repo.createQueryBuilder('users')
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
        it('it called save method', async () => {
            await userService.getByEmail(mockUserFillable.email);
            const savedUser: User = await repo.save(repo.create(mockUserFillable));
            let result = await userService.create(mockUserFillable);
            expect(result).toEqual(savedUser);
        });
        it('it  throws exception if  same email passed', async () => {
            await userService.getByEmail(mockUserFillable.email);
            try {
                await userService.create(mockUserFillable);
            }
            catch (e) {
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');
            }
        });
    });
    describe('addUser method', () => {
        it('it should called save  method ', async () => {
            //await userService.getByEmail(mockUserFillable.email);
            const newUser = await repo.create(mockUserFillable);
            const savedUser: User = await repo.save(newUser);
            expect(savedUser).toBe(mockUser);
            const result = await userService.generateToken(savedUser);
            expect(result).toEqual(mockUserToken);
            const userInfo = {
                token: result.token,
                userName: savedUser.firstName,
                origin: "req.headers['origin']",
            };
            //check user Info
            expect(userInfo.token).toBe(result.token);
            expect(userInfo.userName,).toBe(savedUser.firstName);
            expect(userInfo.origin).toBe("req.headers['origin']");
        });
        it('it  throws exception if  same email passed', async () => {
            jest.spyOn(userService, 'getByEmail').mockRejectedValueOnce(new NotAcceptableException("User with provided email already created."));
            try {
                await userService.addUser(null,req);
            }
            catch (e) {
               
                expect(e.response.error).toBe('Not Acceptable');
                expect(e.message).toBe('User with provided email already created.');
            }
        });

    });
});*/



import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
