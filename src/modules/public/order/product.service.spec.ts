import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './model/product.entity';
import { ProductType } from './model/product-type.entity';
import { OrderProduct, OrderProductFillableFields } from './model/order-product.entity';
import { AddProductDto } from './dto/AddProduct.dto';
import { NotAcceptableException } from '@nestjs/common';
import { UpdateProductDto } from './dto/UpdateProduct.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnThis()
    })),
})

describe('Product Service', () => {
    let productService;
    let productRepository;
    let productTypeRepository: MockRepository;
    let orderProductRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: getRepositoryToken(Product), useValue: createMockRepository() },
                { provide: getRepositoryToken(ProductType), useValue: createMockRepository() },
                { provide: getRepositoryToken(OrderProduct), useValue: createMockRepository() },
            ]
        }).compile();

        productService = await module.get<ProductService>(ProductService);
        productRepository = await module.get<MockRepository>(getRepositoryToken(Product));
        productTypeRepository = module.get<MockRepository>(getRepositoryToken(ProductType));
        orderProductRepository = await module.get<MockRepository>(getRepositoryToken(OrderProduct));
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });

    describe('product service', () => {
        describe('should add/create product', () => {
            it('should add/create product', async () => {

                const mockProduct = {
                    id: 1,
                    productTypeName: 'New',
                    createdBy: 11,
                    modifiedBy: 11,
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                } as ProductType;

                const productTypeDto = {
                    name: 'new',
                    recurrence: true,
                    cost: 100,
                    description: 'new product launch',
                    productTypeId: 1,
                } as AddProductDto;

                productTypeRepository.findOne.mockReturnValue(mockProduct);
                await productRepository.create.mockReturnValue(productTypeDto);
                await productRepository.save.mockReturnValue(productTypeDto);
                expect(productTypeRepository.findOne).not.toHaveBeenCalled();
                expect(productRepository.create).not.toHaveBeenCalled();
                expect(productRepository.create).not.toHaveBeenCalled();
                const product = await productService.addProduct(productTypeDto, { user: { id: 1 } }, 1);
                expect(productTypeRepository.findOne).toHaveBeenCalled();
                expect(productRepository.create).toHaveBeenCalled();
                expect(productRepository.create).toHaveBeenCalled();
                expect(product).toMatchObject(productTypeDto);
            });
        });
        describe('should get all products', () => {
            it('productService - should be defined', () => {
                expect(productService).toBeDefined();
            });
        });
        describe('should get all products', () => {

            // it('should get all products', async () => {
            //     let siteId=1;
            //     const products = [
            //         {
            //             id: 1,
            //             productTypeName: 'Product One',
            //             createdBy: 11,
            //             modifiedBy: 11,
            //             createdAt: new Date(),
            //             modifiedAt: new Date(),
            //         },
            //         {
            //             id: 2,
            //             productTypeName: 'Product Two',
            //             createdBy: 22,
            //             modifiedBy: 22,
            //             createdAt: new Date(),
            //             modifiedAt: new Date(),
            //         }
            //     ];

            //      productRepository
            //     .createQueryBuilder("product")
            //     .where("product.productStatus=1")
            //     .andWhere("product.siteId IN (:...siteId)", { siteId: [siteId] })
            //     .orderBy("product.modifiedAt", "DESC")
            //     .getRawMany();
            //     let  dbProduct = await productService.getAllProducts(siteId);
            //     //expect(dbProduct).not.toBeNull();
            //     //expect(dbProduct).toBe(products);

            // });
        });

        describe('should get product by name', () => {

            it('should get product by name', async () => {
                let productName = "Product One";
                let siteId = 1;
                const product = [
                    {
                        id: 1,
                        productTypeName: 'Product One',
                        createdBy: 11,
                        modifiedBy: 11,
                        createdAt: new Date(),
                        modifiedAt: new Date(),
                    }];

                productRepository
                    .createQueryBuilder("product")
                    .where("product.name ILike :name", { name: `%${productName}%` })
                    .andWhere("product.productStatus=1")
                    .andWhere("product.siteId IN (:...siteId)", { siteId: [siteId] })
                    .getRawMany();
                let dbProduct = await productService.getProductsByName(productName, siteId);
                expect(dbProduct).not.toBeNull();


            });
        });

        describe('should delete product data based on id', () => {

            it('should delete product data based on id', async () => {
                const product =
                {
                    id: 1,
                    productTypeName: 'Product One',
                    createdBy: 11,
                    modifiedBy: 11,
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                };

                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);
                await productService.softDeleteProduct(product.id, { user: { id: 1 } });
                expect(productService.softDeleteProduct).toHaveBeenCalled();
            });

            it('it should throw exception if product id is not provided   ', async () => {
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
                try {
                    await productService.softDeleteProduct(new NotAcceptableException('Product with provided id not available.'));
                } catch (e) {
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('Product with provided id not available.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
        });

        describe('should update product', () => {
            const mockProduct = {
                id: 1,
                productTypeName: 'New product',
                createdBy: 11,
                modifiedBy: 11,
                createdAt: new Date(),
                modifiedAt: new Date(),
                productStatus:1,
                recurrence:true
            } as ProductType;

            const productTypeDto = {
                id: 1,
                name: 'new',
                recurrence: true,
                cost: 100,
                description: 'new product launch',
                productTypeId: 1,
            } as UpdateProductDto;

             const orderProduct=[{
                productName: "string",
                productDescription: "string",
                productId: 1,
                month: 1,
                year: 12,
                cost: 100,
                recurrence: true,
                currentCharge: true,
                startDate: 100,
                endDate: 1000,
                quantity: 1,
                manuallyEnteredProduct: true
              }];

            it('should update the product data based on id and recurrence as true', async () => {
            
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct);
                await productTypeRepository.find.mockReturnValue(productTypeDto);
                await orderProductRepository.find.mockReturnValue(orderProduct);
                const product = await productService.updateProduct(mockProduct.id,productTypeDto, { user: { id: 1 } }, 1);
                expect(productTypeRepository.findOne).toHaveBeenCalled();
                expect(orderProductRepository.update).toHaveBeenCalled();
                expect(orderProductRepository.delete).toHaveBeenCalled();
                expect(product).toMatchObject(productTypeDto);

            });

            it('should update the product data based on id and recurrence as false', async () => {
                orderProduct[0].recurrence= false as boolean;
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(mockProduct);
                await productTypeRepository.find.mockReturnValue(productTypeDto);
                await orderProductRepository.find.mockReturnValue(orderProduct);
                const product = await productService.updateProduct(mockProduct.id,productTypeDto, { user: { id: 1 } }, 1);
                expect(productTypeRepository.findOne).toHaveBeenCalled();
                expect(orderProductRepository.update).toHaveBeenCalled();
                expect(orderProductRepository.delete).toHaveBeenCalled();
                expect(product).toMatchObject(productTypeDto);

            });

            it('it should throw exception if product id is not provided   ', async () => {
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
                try {
                    await productService.softDeleteProduct(new NotAcceptableException('Product with provided id not available.'));
                } catch (e) {
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('Product with provided id not available.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
        });
    });

})