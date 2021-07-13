import { Repository } from "typeorm";
import { UserToken } from "../user/user-token.entity";
import { ResidentCompany } from "./resident-company.entity";
import { ResidentCompanyService } from "./resident-company.service";
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';
import { PassportModule } from "@nestjs/passport";

const mockCompany: any= {};

describe('ResidentCompanyService', () => {
    let residentCompanyService: ResidentCompanyService;
    let userRepository: Repository<ResidentCompany>;
    let userTokenRepository: Repository<UserToken>;
   

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
           
        }).compile();

        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
        userRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
        userTokenRepository = await module.get<Repository<UserToken>>(getRepositoryToken(UserToken));
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);

    });
    
    it('it should be defined', () => {
        expect(residentCompanyService).toBeDefined();
    });

    describe('get method', () => {
        it('it should called findOne  method ', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockCompany);
            expect(await residentCompanyService.get(mockCompany.id)).toEqual(mockCompany);
        });
    });
 
});