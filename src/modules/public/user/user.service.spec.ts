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
import { UpdateUserPayload } from './update-user.payload';
import { ListUserPayload } from './list-user.payload';
import { log } from 'winston';
import { AddUserPayload } from './add-user.payload';

const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');
let mockUser: User = {
    id: 1,
    role: 1,
    site_id: [1, 2],
    companyId: 1,
    email: "superadmin@biolabs.io",
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
    toJSON: null,
    mailsRequestType:null,
    isRequestedMails:null
}
const mockJwtService = () => ({
    sign: jest.fn()
})
const mockMailService = () => ({
    sendEmail: jest.fn()
});
const mockResidentCompanyService = () => ({
    getResidentCompany: jest.fn()
});
let mockUserFillable: UserFillableFields = {
    email: "testadmin@biolabs.io", password: "test@1234", role: 1, site_id: [1, 2], companyId: 1,
    firstName: "adminName", lastName: "userLast", title: "SuperAdmin", phoneNumber: "2345678902",
    status: '1', userType: '1', imageUrl: "admin.jpg"
}
const mockSites: any = [
    {
        "id": 1,
        "name": "Tufts",
        "longName": "Tufts Launchpad",
        "standardizedAddress": "75 Kneeland St, 14th Floor Boston, MA 02111",
        "colorCode": "#6baecf",
        "googleMapUrl": "https://goo.gl/maps/J6KRZNuGFrWkk7iG6",
        "siteMapBoxImgUrl": "https://biolabsblobdev.blob.core.windows.net/configuration/Tufts.png",
        "status": "1"
    },
    {
        "id": 2,
        "name": "Ipsen",
        "longName": "Ipsen Innovation Center",
        "standardizedAddress": "650 E Kendall St 2nd Floor, Cambridge, MA 02142",
        "colorCode": "#26294a",
        "googleMapUrl": "https://goo.gl/maps/PuKw7cvjxKxsApNN7",
        "siteMapBoxImgUrl": "https://biolabsblobdev.blob.core.windows.net/configuration/Ipsen.png",
        "status": "1"
    },
]

const mockUserToken: UserToken = { id: 1, user_id: 1, token: "mockToken", status: "1", createdAt: 2021, updatedAt: 2021 };
const req: any = {
    user: { id: 1 },
    headers: ['origin']
}
const userInfo = {
    token: mockUserToken.token,
    userName: mockUser.firstName,
    origin: req.headers['origin'],
    userRole: mockUserFillable.role
};
describe('UserService', () => {
    let userService: UsersService;
    let userRepository: Repository<User>;
    let userTokenRepository: Repository<UserToken>;
    let residentCompanyService;
    let jwtService;
    let mailService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
            providers: [
                UsersService,
                { provide: JwtService, useFactory: mockJwtService },
                { provide: Mail, useFactory: mockMailService },
                { provide: ResidentCompanyService, useFactory: mockResidentCompanyService },
                {
                    provide: getRepositoryToken(User),
                    useValue:
                    {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        create: jest.fn(() => mockUser),
                        save: jest.fn(),
                        update: jest.fn(),
                        createQueryBuilder: jest.fn(() =>
                        ({
                            addSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            setParameter: jest.fn().mockReturnThis(),
                            getOne: jest.fn(),
                            andWhere: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            addOrderBy: jest.fn().mockReturnThis(),
                            getMany: jest.fn(),
                            update: jest.fn().mockReturnThis(),
                            set: jest.fn().mockReturnThis(),
                            execute:jest.fn()
                        })),
                    }
                },
                {
                    provide: getRepositoryToken(UserToken), useValue: {
                        find: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                    }
                },

            ]
        }).compile();

        userService = await module.get<UsersService>(UsersService);
        mailService = await module.get<Mail>(Mail);
        jwtService = await module.get<JwtService>(JwtService);
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
        it('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userRepository, 'createQueryBuilder').mockReturnValue(null);
            try {
                await userService.getByEmail(new BiolabsException('User with provided id not available.'));
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();  
            }
        });
    });
    describe('generate Token  method', () => {
        it('it should called generateToken  method ', async () => {
            let token = "Token";
            const mockToken: UserToken[] = [{ id: 1, user_id: 1, token: "mockToken", status: "1", createdAt: 2021, updatedAt: 2021 }];

            jest.spyOn(jwtService, "sign").mockResolvedValue(token);
            const tokenData = { user_id: mockUser.id, token: token };
            jest.spyOn(userTokenRepository, "find").mockResolvedValue(mockToken);
            if (mockToken) {
                mockToken[0].user_id = mockUser.id;
                mockToken[0].status = "99";
            }
            mockUserToken.user_id = tokenData.user_id;
            mockUserToken.token = tokenData.token;
            jest.spyOn(userTokenRepository, 'save').mockResolvedValueOnce(mockUserToken);
            let ans = await userService.generateToken(mockUser);
            expect(ans).not.toBeNull();
            expect(ans).toBe(mockUserToken);
        });
        it('should throw exception ', async () => {
            jest.spyOn(userTokenRepository, "find").mockImplementation(() => {
                throw new BiolabsException('Getting error in generating user token')
            });
            try {
                await  userService.generateToken(mockUser);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
            }
        });
    });
    describe('create method', () => {
        it('should create user if email already not exist', async () => {
            mockUser.email = "superadmin@biolabs.io"
            jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
              jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);
              await  userService.create(mockUserFillable, mockSites);
        });

        it('it should throw exception if user id is not provided  ', async () => {
            mockUser.email = "nonAdmin@account.com"
            jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
            try {
              await  userService.create(mockUserFillable, mockSites);
            } catch (e) {
              expect(e.response.error).toBe('Not Acceptable');
              expect(e.response.message).toBe('User with provided email already created.');
              expect(e.response.statusCode).toBe(406);
            }
        });

        it('should save user if user type is super-admin', async () => {
            mockUserFillable.email = "admin@gmail.com";
            userRepository.createQueryBuilder('mockUser')
                .addSelect("mockUser.email")
                .addSelect("mockUser.password")
                .where('mockUser.email = :email')
                .setParameter('email', mockUserFillable.email)
                .getOne();
            const siteArr = mockSites.map((site) => site.id);
            mockUser = { ...mockUser, ...{ id: 1, site_id: siteArr } } as User;
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);
            let ans = await userService.create(mockUserFillable, mockSites);
            expect(ans).toBe(mockUser);
            expect(ans.site_id.length).toBe(siteArr.length);
        })
    });

    describe('adduser method', () => {

        it('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userService, 'getByEmail').mockRejectedValueOnce(new NotAcceptableException("User with provided email already created."));
            try {
                await userService.addUser(mockUserFillable, req);
            } catch (e) {    
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        });
        it('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userService, 'getByEmail').mockRejectedValueOnce(new InternalException('Getting error to create the new user'));
            try {
                await userService.addUser(mockUserFillable, req);
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        });

    });
    describe('Update User method', () => {
        let payload: UpdateUserPayload = {
            userType: '1', companyId: 1, firstName: "adminName", lastName: "userLast",
            title: "SuperAdmin", phoneNumber: "2345678902", site_id: [1],
            password: "test@1234", passwordConfirmation: "test@1234", id: 1
        };
        it('should update user data ', async () => {

            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
            if (mockUser) {
                mockUser.firstName = payload.firstName;
                mockUser.lastName = payload.lastName;
                mockUser.title = payload.title;
                mockUser.phoneNumber = payload.phoneNumber;
                mockUser.companyId = (payload.companyId) ? payload.companyId : mockUser.companyId;
                mockUser.userType = payload.userType;
                mockUser.site_id = payload.site_id;
                await userRepository.update(mockUser.id, mockUser);
                jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(mockUser);
                const updateUser = await userService.updateUser(payload);
                expect(updateUser).not.toBeNull();
                expect(updateUser.firstName).toEqual(mockUser.firstName);
                expect(updateUser.userType).toEqual(mockUser.userType);
                expect(updateUser).toBe(mockUser);
            }
        })

        it('it should throw exception if user id is not provided   ', async () => {
            jest.spyOn(userService, 'getUserById').mockRejectedValueOnce(new NotAcceptableException('User with provided id not available.'));
            try {
                await userService.updateUser(payload);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();  
                expect(e.message).toBe('Getting error in updating user');
            }
        });
    });
    describe('getUsers method', () => {
        let payload: ListUserPayload = {
            q: "test", role: 1, pagination: true, page: 12,
            limit: 4, sort: true, sortFiled: "test", sortOrder: "ASC"
        };
        it('should update user data ', async () => {
            userRepository.createQueryBuilder("users")
                .where("users.status IN (:...status)", { status: [1, 0] })
                .andWhere("users.site_id && ARRAY[:...siteIdArr]::int[]", { siteIdArr: mockUser.site_id });
            await userService.getUsers(payload, mockUser.site_id);

        });

        describe('updateUserProfilePic method', () => {
            it('should updateUserProfilePic data based on id', async () => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
                let users = await userService.updateUserProfilePic(mockUser.id);
                expect(users).not.toBeNull();
                delete users.password;
                users.imageUrl = mockUserFillable.imageUrl;
                userRepository.update(users.id, users);
                expect(users.imageUrl).toBe(mockUser.imageUrl);
            })

            it('it should throw exception if user id is not provided   ', async () => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
                try {
                    await userService.updateUserProfilePic(new NotAcceptableException('User with provided id not available.'));
                } catch (e) {
                    expect(e.name).toBe('BiolabsException');
                    expect(e instanceof BiolabsException).toBeTruthy();  
                    expect(e.message).toBe('Getting error in updating the user profile picture');
                }
            });
        });
        describe('getUserById method', () => {
            let mockResidentCompany = {
                "id": 1,
                "email": "ipsen@mailinator.com",
                "name": "Ipsen",
                "companyName": "ipsenTest",
            }
            it('should getUserById data based on id', async () => {
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
                if (mockUser) {
                    if (mockUser.companyId) {
                        jest.spyOn(residentCompanyService, "getResidentCompany").mockResolvedValueOnce(mockResidentCompany);
                    }
                }
                const users = await userService.getUserById(mockUser.id);
                expect(users).not.toBeNull();
                expect(users.companyId).toEqual(mockUser.companyId);
                expect(users).toBe(mockUser);
            })

            it('it should throw exception if user id is not provided   ', async () => {
                jest.spyOn(userService, 'get').mockResolvedValueOnce(null);
                try {
                    await userService.getUserById(new NotAcceptableException('User with provided id not available.'));
                } catch (e) {   
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('User with provided id not available.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
        });
        describe('validateToken method', () => {
            it('should validateToken data based on tokenid', async () => {
                jest.spyOn(userTokenRepository, 'findOne').mockResolvedValue(mockUserToken);
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
                let users = await userService.validateToken(mockUserToken.token);
                expect(users).not.toBeNull();
            })
            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new NotAcceptableException('Token is invalid.'));
                try {
                    await userService.validateToken(mockUserToken.token);
                } catch (e) {
                    expect(e.name).toBe('BiolabsException');
                    expect(e instanceof BiolabsException).toBeTruthy();  
                    expect(e.message).toBe('Getting error in validating the user tokenToken is invalid.');
                }
            });
            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userTokenRepository, 'findOne').mockResolvedValue(mockUserToken);
                jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
                mockUser.status='-1';
                try {
                    await userService.validateToken(mockUserToken.token);
                } catch (e) {
                    expect(e.name).toBe('BiolabsException');
                    expect(e instanceof BiolabsException).toBeTruthy();  
                    expect(e.message).toBe('Getting error in validating the user tokenToken is invalid.');
                }
            });
        });
        describe('setNewPassword method', () => {
            const mockPasswordPayload = {
                token: "mockToken", password: "biolabsAdmin",
                passwordConfirmation: "biolabsAdmin"
            };
            const mockUserSetPass: User = {
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
                toJSON: null,
                mailsRequestType:null,
                isRequestedMails:null
            }

            it('should  set setNewPassword ', async () => {
                jest.spyOn(userTokenRepository, 'findOne').mockResolvedValue(mockUserToken);
                jest.spyOn(userService, 'get').mockResolvedValueOnce(mockUserSetPass);
                mockUserSetPass.password = mockPasswordPayload.password;
                mockUserSetPass.status = '1';
                jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUserSetPass);
                mockUserToken.status = '99';
                jest.spyOn(userTokenRepository, 'save').mockResolvedValueOnce(mockUserToken);
                let newUser = await userService.setNewPassword(mockPasswordPayload);
                expect(newUser).not.toBeNull();
                expect(newUser.password).toEqual(mockUserSetPass.password);
                expect(newUser).toEqual(mockUserSetPass);
            })
            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userTokenRepository, 'save').mockRejectedValueOnce(new NotAcceptableException('Token is invalid.'));
                try {
                    await userService.setNewPassword(mockPasswordPayload);
                } catch (e) {
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('Token is invalid.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userTokenRepository, 'findOne').mockResolvedValue(mockUserToken);
                mockUserSetPass.status = '-1';
                jest.spyOn(userService, 'get').mockResolvedValueOnce(mockUserSetPass);
                try {
                    await userService.setNewPassword(mockPasswordPayload);
                } catch (e) {
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('Token is invalid.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
        });
        describe('forgotPassword method', () => {
            let payload: UserFillableFields = {
                email: "test@biolabs.io", role: 1, companyId: 1, site_id: [1], firstName: "adminName", lastName: "userLast",
                imageUrl: "eadzfxdsz", title: "SuperAdmin", phoneNumber: "2345678902", userType: '1',
                password: "test@1234",
                status: '1'
            };
            it('should  forgotPassword ', async () => {
                jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(mockUser);
                if (mockUser) {
                    jest.spyOn(userService, 'generateToken').mockResolvedValueOnce(mockUserToken);
                };
                let tenant = { tenantEmail: payload.email, role: payload.role };
                let newUser = await userService.forgotPassword(payload, req);
                expect(newUser).not.toBeNull();
                expect(newUser).toBeTruthy();
            })


            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce( new BiolabsException('Getting error in forget password process'));
                try {
                    await userService.forgotPassword(payload, req);
                } catch (e) {
                    expect(e.name).toBe('BiolabsException');
                    expect(e instanceof BiolabsException).toBeTruthy();  
                    expect(e.message).toBe('Getting error in forget password process');
                }
            });
            it('it should throw exception if Token is invalid  ', async () => {
                jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce( null);
                try {
                    await userService.forgotPassword(payload, req);
                } catch (e) {
                    expect(e.name).toBe('BiolabsException');
                    expect(e instanceof BiolabsException).toBeTruthy();  
                    expect(e.message).toBe('Getting error in forget password process');
                }
            });

        });
    });
    describe('softDelete method', () => {
        it('should delete data based on id', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(userRepository, 'save').mockResolvedValueOnce(mockUser);
            const users = await userService.softDeleteUser(mockUser.id);
            expect(users).toBe(mockUser);
        })
        it('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
            try {
                await userService.softDeleteUser(mockUser.id);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();  
                expect(e.message).toBe('Error in soft delete user');
            }
        });
        it('it should throw exception if user id is not provided  ', async () => {
            jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new BiolabsException('User with provided id not available.'));
            try {
                await userService.softDeleteUser(mockUser.id);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();  
                expect(e.message).toBe('Error in soft delete user');
            }
        });
    });
    describe('getSiteNameBySiteId method', () => {
        it('should call getSiteNameBySiteId method', async () => {
            expect(await userService.getSiteNameBySiteId([1,2], 1)).toBeDefined();
        })
    });
    describe('fetchSponsorUsers method', () => {
        const mockSponsorList:any=[
            {
             id: 1,
             role: 3,
             site_id: [ 2, 1 ],
             companyId: null,
             email: 'spo_week@mailinator.com',
             firstName: 'SpoWeek',
             lastName: 'Week',
             title: 'Sponsor User',
             phoneNumber: '8787875487',
             status: '1',
             imageUrl: null,
             userType: '4',
             mailsRequestType: '0',
             isRequestedMails: true,
             createdAt: 2021,
             updatedAt: 2021,
             
           }
        ]
        it('should call fetchSponsorUsers method', async () => {
           
            jest.spyOn(userRepository,'find').mockResolvedValueOnce(mockSponsorList);
            let result=await userService.fetchSponsorUsers(1);
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result.length).toEqual(mockSponsorList.length)
            
        })
        it('should throw error when  fetching sponsor users.', async () => {
            jest.spyOn(userRepository,'find').mockRejectedValueOnce(mockSponsorList);
            try {
                await userService.fetchSponsorUsers(1);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
                expect(e.message).toEqual("Error in fetching sponsor users.");
            }
        });
    });
});



