import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct, OrderProductFillableFields } from './model/order-product.entity';
import { OrderProductService } from './order-product.service';
import { ResidentCompany, ResidentCompanyService } from '../resident-company';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { HttpException, HttpStatus, NotAcceptableException } from '@nestjs/common';
import { Product } from './model/product.entity';
const { InternalException, BiolabsException } = require('../../common/exception/biolabs-error');
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
        orderBy: jest.fn().mockReturnThis()
    })),
})

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

const mockResidentService = () => ({
    checkIfValidSiteIds: jest.fn()
})

describe('Order Product Service', () => {
    let orderProductService;
    let orderProductRepository;
    let productRepository;
    let residentCompanyRepository: Repository<ResidentCompany>;
    let residentCompanyService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                OrderProductService,
                { provide: ResidentCompanyService, useFactory: mockResidentService },
                {
                    provide: getRepositoryToken(OrderProduct), useValue: {
                        createQueryBuilder: jest.fn(() =>
                        ({
                            addSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            setParameter: jest.fn().mockReturnThis(),
                            getOne: jest.fn().mockReturnThis(),
                            leftJoin: jest.fn().mockReturnThis(),
                            select: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            getRawOne: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            addOrderBy: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            getMany: jest.fn().mockReturnThis(),
                            getRawMany: jest.fn().mockReturnThis(),
                            query: jest.fn()
                        })),
                        find: jest.fn(() => {
                            return {
                                catch: jest.fn(),
                            }
                        }),
                        findOne: jest.fn(() => {
                            return {
                                catch: jest.fn(),
                            }
                        }),
                        findByIds: jest.fn(),
                        save: jest.fn(() => {
                            return {
                                catch: jest.fn(),
                            }
                        }),
                        query: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(() => {
                            return {
                                catch: jest.fn(),
                            }
                        }),
                        update: jest.fn(() => {
                            return {
                                catch: jest.fn(),
                            }
                        }),
                    }
                },
                {
                    provide: getRepositoryToken(ResidentCompany), useValue: {
                        createQueryBuilder: jest.fn(() =>
                        ({
                            addSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            setParameter: jest.fn().mockReturnThis(),
                            getOne: jest.fn().mockReturnThis(),
                            leftJoin: jest.fn().mockReturnThis(),
                            select: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            getRawOne: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            addOrderBy: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            getMany: jest.fn().mockReturnThis(),
                            getRawMany: jest.fn().mockReturnThis(),
                            query: jest.fn()
                        })),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        save: jest.fn(),
                        query: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Product), useValue: {
                        createQueryBuilder: jest.fn(() =>
                        ({
                            addSelect: jest.fn().mockReturnThis(),
                            where: jest.fn().mockReturnThis(),
                            setParameter: jest.fn().mockReturnThis(),
                            getOne: jest.fn().mockReturnThis(),
                            leftJoin: jest.fn().mockReturnThis(),
                            select: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            getRawOne: jest.fn().mockReturnThis(),
                            orderBy: jest.fn().mockReturnThis(),
                            addOrderBy: jest.fn().mockReturnThis(),
                            skip: jest.fn().mockReturnThis(),
                            take: jest.fn().mockReturnThis(),
                            getMany: jest.fn().mockReturnThis(),
                            getRawMany: jest.fn().mockReturnThis(),
                            query: jest.fn()
                        })),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        save: jest.fn(),
                        query: jest.fn()
                    }
                }
            ]
        }).compile();

        orderProductService = await module.get<OrderProductService>(OrderProductService);
        residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
        residentCompanyRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
        orderProductRepository = await module.get<MockRepository>(getRepositoryToken(OrderProduct));
        productRepository = await module.get<MockRepository>(getRepositoryToken(Product));
    });

    it('should be defined', () => {
        expect(orderProductService).toBeDefined();
    });

    describe('should add/create order product', () => {
        const orderProductDto = {
            productName: 'new',
            productId: 1,
            productDescription: 'new product launch',
            startDate: new Date().toISOString().slice(0, 10),
            status: 0,
            companyId: 1,
            cost: 100,
            currentCharge: true,
            endDate: new Date().toISOString().slice(0, 10),
            manuallyEnteredProduct: true,
            recurrence: true,
            year: 2000,
            month: 12,
            quantity: 1
        } as CreateOrderProductDto;
        it('should add/create order product', async () => {
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(orderProductDto);
            const product = await orderProductService.addOrderProduct(orderProductDto);
            expect(product).not.toBeNull();
            expect(product.message).toEqual("Added successfully");
            expect(product.status).toEqual("success");
        });
        it('should throw exception ', async () => {
            jest.spyOn(orderProductRepository, 'save').mockRejectedValueOnce(() => {
                throw new InternalException('')
            });
            try {
                await orderProductService.addOrderProduct(orderProductDto);
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        });
        it('should validate the start date', async () => {
            orderProductDto.startDate = "start date";
            orderProductDto.endDate = "end date"
            const product = await orderProductService.addOrderProduct(orderProductDto);
            expect(product).not.toBeNull();
            expect(product.message).toContain("Prodvide correct date formate");
            expect(product.status).toContain("error");
        });
        it('should validate the end date', async () => {
            orderProductDto.startDate = new Date().toISOString().slice(0, 10),
                orderProductDto.endDate = "end date"
            const product = await orderProductService.addOrderProduct(orderProductDto);
            expect(product).not.toBeNull();
            expect(product.message).toContain("Prodvide correct date formate");
            expect(product.status).toContain("error");
        });

        it('should validate the start/end date', async () => {
            orderProductDto.startDate = "2021-07-16";
            orderProductDto.endDate = "2020-07-16";
            const product = await orderProductService.addOrderProduct(orderProductDto);
            expect(product).not.toBeNull();
            expect(product.error).not.toBeNull();
            expect(product.error).toContain("Please Select Valid Start Date and End Date");
        });

    });

    describe('should update order product', () => {
        let id = 1;
        const orderProductDto = {
            productName: 'new',
            productId: 1,
            productDescription: 'new product launch',
            startDate: new Date().toISOString().slice(0, 10),
            status: 1,
            companyId: 1,
            cost: 100,
            currentCharge: true,
            endDate: new Date().toISOString().slice(0, 10),
            manuallyEnteredProduct: true,
            recurrence: true,
            year: 2000,
            month: 12,
            quantity: 1,
            groupId: 1,
            productTypeId: 1
        } as UpdateOrderProductDto;
        const orderProducts = [{ orderProductDto }];
        it('should update order product', async () => {
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'find').mockResolvedValueOnce(orderProducts);
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(orderProductDto);
            if (!orderProductDto.recurrence) {
                for await (const product of orderProducts) {
                    jest.spyOn(orderProductRepository, 'delete').mockResolvedValueOnce(product);
                }
            }
            jest.spyOn(orderProductRepository, 'update').mockResolvedValueOnce(orderProductDto);
            let product = await orderProductService.updateOrderProduct(id, orderProductDto);
            expect(product).not.toBeNull();
        })

        it('should update order product with recurence false', async () => {
            orderProductDto.recurrence = false;
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'find').mockResolvedValueOnce(orderProducts);
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(orderProductDto);
            if (!orderProductDto.recurrence) {
                for await (const product of orderProducts) {
                    jest.spyOn(orderProductRepository, 'delete').mockResolvedValueOnce(product);
                }
            }
            jest.spyOn(orderProductRepository, 'update').mockResolvedValueOnce(orderProductDto);
            let product = await orderProductService.updateOrderProduct(id, orderProductDto);
            expect(product).not.toBeNull();
            expect(product).toMatchObject(orderProductDto);
        })
        it('should throw BiolabsException', async () => {

            jest.spyOn(orderProductRepository, 'findOne').mockRejectedValueOnce(new BiolabsException(''));
            try {
                await orderProductService.updateOrderProduct(id, orderProductDto);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
            }
        })
        it('should throw internalException', async () => {
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'find').mockRejectedValueOnce(new BiolabsException(''));
            try {
                await orderProductService.updateOrderProduct(id, orderProductDto);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
            }
        })
        it('should throw internalException', async () => {
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'find').mockResolvedValueOnce(orderProducts);
            if (!orderProductDto.recurrence) {
                for await (const product of orderProducts) {
                    jest.spyOn(orderProductRepository, 'delete').mockRejectedValueOnce(new InternalException(''));
                }
            }
            try {
                await orderProductService.updateOrderProduct(id, orderProductDto);
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        })
        it('should throw internalException', async () => {
            jest.spyOn(orderProductRepository, 'findOne').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'find').mockResolvedValueOnce(orderProducts);
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(orderProductDto);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(orderProductDto);
            if (!orderProductDto.recurrence) {
                for await (const product of orderProducts) {
                    jest.spyOn(orderProductRepository, 'delete').mockResolvedValueOnce(product);
                }
            }
            jest.spyOn(orderProductRepository, 'update').mockRejectedValueOnce(new InternalException(''));
            try {
                await orderProductService.updateOrderProduct(id, orderProductDto);
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        })

        it('should validate the start date', async () => {
            orderProductDto.startDate = "start date";
            orderProductDto.endDate = "end date"
            const product = await orderProductService.updateOrderProduct(id, orderProductDto);
            expect(product).not.toBeNull();
            expect(product.message).toContain("Prodvide correct date formate");
            expect(product.status).toContain("error");
        });
        it('should validate the end date', async () => {
            orderProductDto.startDate = new Date().toISOString().slice(0, 10),
                orderProductDto.endDate = "end date"
            const product = await orderProductService.updateOrderProduct(id, orderProductDto);
            expect(product).not.toBeNull();
            expect(product.message).toContain("Prodvide correct date formate");
            expect(product.status).toContain("error");
        });

    });

    describe('should fetch the order products between given start date and end date', () => {
        let siteIdArr: [1, 2];
        let mockOrderProduct: [
            {
                productName: 'new',
                productId: 1,
                productDescription: 'new product launch',
                startDate: "2021-07-16",
                status: 1,
                companyId: 1,
                cost: 100,
                currentCharge: true,
                endDate: "2021-07-16",
                manuallyEnteredProduct: true,
                recurrence: true,
                year: 2000,
                month: 12,
                quantity: 1
            }
        ]
        // TODO
        it('fetch the order products between given start date and end date', async () => {
            jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
            jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockResolvedValue(true);
            orderProductRepository.createQueryBuilder("order_product")
                .where("order_product.companyId = :companyId", { companyId: mockRC.id })
                .andWhere("order_product.month = :month", { month: 12 })
                .orderBy("order_product.updatedAt", 'DESC')
                .getRawMany();
            let dbOrderProduct = await orderProductService.fetchOrderProductsBetweenDates(12, 1, mockRC.id, siteIdArr);
            expect(dbOrderProduct).not.toBeNull();
        });

        it('it should throw NotAcceptableException if company by id not found while fetching order products between dates   ', async () => {
            jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
            jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockReturnThis();
            jest.spyOn(orderProductRepository, 'createQueryBuilder').mockRejectedValue(mockOrderProduct);

            try {
                await orderProductService.fetchOrderProductsBetweenDates(12, 1, siteIdArr);
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
                expect(e.message).toBe('Error in fetching order products between dates');
            }
        });

        it('it should throw NotAcceptableException if company by id not found while fetching order products between dates   ', async () => {
            jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockResolvedValue(null);
            try {
                await orderProductService.fetchOrderProductsBetweenDates(12, 1, siteIdArr);
            } catch (e) {
                expect(e.response.statusCode).toBe(406);
                expect(e.response.message).toBe('Company with provided id not available.');
                expect(e.response.error).toBe('Not Acceptable');
            }
        });
    });

    describe('should delete the order products', () => {
        it(' should delete the order products', async () => {
            let mockOrderProduct = [
                {
                    productName: 'new',
                    productId: 1,
                    productDescription: 'new product launch',
                    startDate: new Date().toISOString().slice(0, 10),
                    status: 0,
                    companyId: 1,
                    cost: 100,
                    currentCharge: true,
                    endDate: new Date().toISOString().slice(0, 10),
                    manuallyEnteredProduct: true,
                    recurrence: true,
                    year: 2000,
                    month: 12,
                    quantity: 1,
                    groupId: 1,
                    id: 1
                }
            ]
            jest.spyOn(orderProductRepository, "findByIds").mockResolvedValueOnce(mockOrderProduct);
            jest.spyOn(orderProductRepository, "find").mockResolvedValueOnce(mockOrderProduct);
            for await (const order of mockOrderProduct) {
                jest.spyOn(orderProductRepository, 'delete').mockResolvedValueOnce(order);
            }
            let dbOrderProduct = await orderProductService.deleteOrderProduct(1);
            expect(dbOrderProduct).not.toBeNull();
        });
        it('it should throw exception if product is not getting   ', async () => {
            jest.spyOn(orderProductRepository, 'delete').mockResolvedValueOnce(null);
            try {
                await orderProductService.deleteOrderProduct(new InternalException(''));
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        });
    });

    describe('should add future order products', () => {
        const mockOreProduct = {
            productName: 'new',
            productId: 1,
            productDescription: 'new product launch',
            startDate: new Date().toISOString().slice(0, 10),
            status: 1,
            companyId: 1,
            cost: 100,
            currentCharge: true,
            endDate: new Date().toISOString().slice(0, 10),
            manuallyEnteredProduct: true,
            recurrence: true,
            year: 2000,
            month: 12,
            quantity: 1
        }
        it('should add future order products', async () => {
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(mockOreProduct);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(mockOreProduct);
            const dbOrderProduct = await orderProductService.addFutureOrderProducts(mockOreProduct);
            expect(dbOrderProduct).not.toBeNull();
            // expect(dbOrderProduct).toBe(mockOreProduct);
        });
        it('should throw internalException', async () => {

            jest.spyOn(orderProductRepository, 'create').mockRejectedValueOnce(new InternalException(''));
            jest.spyOn(orderProductRepository, 'save').mockRejectedValueOnce(new InternalException(''));
            try {
                await orderProductService.addFutureOrderProducts(mockOreProduct);
            } catch (e) {
                expect(e.name).toBe('InternalException');
                expect(e instanceof InternalException).toBeTruthy();
            }
        })
    });


    describe('should fetch the all invoices based on month', () => {
        const monthInvoices = [
            {
                "companyid": 3,
                "orderid": 28,
                "companyName": "ipsenTest",
                "month": 6,
                "productName": "lab bench 1",
                "productDescription": "",
                "cost": null,
                "quantity": 1,
                "recurrence": true,
                "currentCharge": true,
                "startDate": null,
                "endDate": null
            },

            {
                "companyid": 3,
                "orderid": 144,
                "companyName": "ipsenTest",
                "month": 6,
                "productName": "lab bench2",
                "productDescription": "",
                "cost": null,
                "quantity": 1,
                "recurrence": true,
                "currentCharge": true,
                "startDate": null,
                "endDate": null
            },

            {
                "companyid": 4,
                "orderid": 3,
                "companyName": "weasrdwedf",
                "month": 6,
                "productName": "private lab1",
                "productDescription": "",
                "cost": null,
                "quantity": 1,
                "recurrence": true,
                "currentCharge": true,
                "startDate": null,
                "endDate": null
            }];
        it(' fetch fetch the all invoices based on month', async () => {
            jest.spyOn(residentCompanyRepository, 'query').mockResolvedValueOnce(monthInvoices);
            let result = await orderProductService.consolidatedInvoice(6, 1)
            expect(result).not.toBeNull()
            expect(result[0]).toEqual(monthInvoices[0]);
            expect(result[1]).toEqual(monthInvoices[1]);
            expect(result.length).toEqual(monthInvoices.length);
        });
        it('it should throw exception while fetching order products between dates   ', async () => {
            jest.spyOn(residentCompanyRepository, 'query').mockRejectedValueOnce(null);
            try {
                await orderProductService.consolidatedInvoice(new BiolabsException('Error in find consolidated Invoice'));
            } catch (e) {
                expect(e.name).toBe('BiolabsException');
                expect(e instanceof BiolabsException).toBeTruthy();
                expect(e.message).toBe('Error in find consolidated Invoice');
            }
        });
    });
});