import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct, OrderProductFillableFields } from './model/order-product.entity';
import { OrderProductService } from './order-product.service';
import { ResidentCompany } from '../resident-company';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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

describe('Order Product Service', () => {
    let orderProductService;
    let orderProductRepository;
    let residentCompanyRepository: Repository<ResidentCompany>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                OrderProductService,
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
                }
            ]
        }).compile();

        orderProductService = await module.get<OrderProductService>(OrderProductService);
        residentCompanyRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
        orderProductRepository = await module.get<MockRepository>(getRepositoryToken(OrderProduct));
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
            groupId :1
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
            orderProductDto.recurrence=false;
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
            let product =await orderProductService.updateOrderProduct(id, orderProductDto);
            expect(product).not.toBeNull();
            expect(product).toMatchObject(orderProductDto);
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
        it(' fetch the order products between given start date and end date', async () => {
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

            orderProductRepository.createQueryBuilder("order_product")
                .where("order_product.companyId = :companyId", { companyId: 1 })
                .andWhere("order_product.month = :month", { month: 12 })
                .orderBy("order_product.updatedAt", 'DESC')
                .getRawMany();
            let dbOrderProduct = await orderProductService.fetchOrderProductsBetweenDates(12, 1);
            expect(dbOrderProduct).not.toBeNull();
        });
    });

    describe('should delete the order products', () => {
        it(' should delete the order products', async () => {
            let mockOrderProduct = [
                {
                    productName: 'new',
                    productId: 1,
                    productDescription: 'new product launch',
                    startDate:  new Date().toISOString().slice(0, 10),
                    status: 0,
                    companyId: 1,
                    cost: 100,
                    currentCharge: true,
                    endDate:  new Date().toISOString().slice(0, 10),
                    manuallyEnteredProduct: true,
                    recurrence: true,
                    year: 2000,
                    month: 12,
                    quantity: 1,
                    groupId:1,
                    id:1
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
    });

    describe('should add future order products', () => {
        it('should add future order products', async () => {
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
            jest.spyOn(orderProductRepository, 'create').mockResolvedValueOnce(mockOreProduct);
            jest.spyOn(orderProductRepository, 'save').mockResolvedValueOnce(mockOreProduct);
            const dbOrderProduct = await orderProductService.addFutureOrderProducts(mockOreProduct);
            expect(dbOrderProduct).not.toBeNull();
           // expect(dbOrderProduct).toBe(mockOreProduct);
        });
    });


    describe('should fetch the all invoices based on month', () => {
        it(' fetch fetch the all invoices based on month', async () => {
            const query = `select 
            rc."id" as companyid, 
            orp.id as orderId,
            rc."companyName", 
            orp."month", 
            orp."productName", 
            orp."productDescription", 
            orp."cost", 
            orp."quantity", 
            orp."recurrence", 
            orp."currentCharge", 
            orp."startDate", 
            orp."endDate" 
          from 
            resident_companies as rc 
            LEFT JOIN (
              select
                orpd.id,
                orpd."companyId", 
                orpd."productName", 
                orpd."month", 
                orpd."productDescription", 
                orpd."cost", 
                orpd."quantity", 
                orpd."recurrence", 
                orpd."currentCharge", 
                orpd."startDate", 
                orpd."endDate" 
              from 
                order_product as orpd 
              where 
                (
                  orpd."month" =2 
                  or orpd."month" isnull
                )
            ) as orp on orp."companyId" = rc."id" 
          where 
            rc."site" && ARRAY[1] :: int[] 
            and rc."companyStatus" = '1' 
          group by 
            rc."id", 
            orp."id",
            rc."companyName",
            orp."month", 
            orp."productName", 
            orp."productDescription", 
            orp."cost", 
            orp."quantity", 
            orp."recurrence", 
            orp."currentCharge", 
            orp."startDate", 
            orp."endDate" 
          order by 
            rc."companyName", 
            orp."productName"`;
            residentCompanyRepository.query(query);
            let result = await orderProductService.consolidatedInvoice(1, 1)
            expect(result).not.toBeNull()
        });
    });
});