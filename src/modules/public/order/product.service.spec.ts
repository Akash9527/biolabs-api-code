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
const req: any = {
    user: { id: 1 }
}
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

describe('Product Service', () => {
    let productService;
    let productRepository: MockRepository;
    let productTypeRepository: MockRepository;
    let orderProductRepository: MockRepository;

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
                let siteId = 1;
                const mockProduct = {
                    id: 1,
                    productTypeName: 'New',
                    createdBy: 11,
                    modifiedBy: 11,
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                } as ProductType;

                const payLoad = {
                    name: 'new',
                    recurrence: true,
                    cost: 100,
                    description: 'new product launch',
                    productTypeId: mockProduct.id,
                } as AddProductDto;

                if (payLoad.productTypeId) {
                    productTypeRepository.findOne.mockReturnValue(mockProduct);
                }

                const product = new Product();
                product.name = payLoad.name;
                product.description = payLoad.description;
                product.recurrence = payLoad.recurrence;
                product.cost = payLoad.cost;
                product.siteId = siteId;
                product.createdBy = req.user.id;
                product.modifiedBy = req.user.id;
                product.productType = mockProduct;
                await productRepository.create.mockReturnValue(payLoad);
                jest.spyOn(productRepository, 'save').mockResolvedValueOnce(product);
                const products = await productService.addProduct(payLoad, req, siteId);
                expect(products).not.toBeNull();
                expect(product).toMatchObject(products);
            });
        });
        describe('should get all products', () => {
            it('productService - should be defined', () => {
                expect(productService).toBeDefined();
            });
        });
        describe('should get all products', () => {

            it('should get all products', async () => {
                let siteId = 1;
                const products = [
                    {
                        id: 1,
                        productTypeName: 'Product One',
                        createdBy: 11,
                        modifiedBy: 11,
                        createdAt: new Date(),
                        modifiedAt: new Date(),
                    },
                    {
                        id: 2,
                        productTypeName: 'Product Two',
                        createdBy: 22,
                        modifiedBy: 22,
                        createdAt: new Date(),
                        modifiedAt: new Date(),
                    }
                ];

                productRepository
                    .createQueryBuilder("product")
                    .where("product.productStatus=1")
                    .andWhere("product.siteId IN (:...siteId)", { siteId: [siteId] })
                    .orderBy("product.modifiedAt", "DESC")
                    .getRawMany();
                jest.spyOn(productService, "getAllProducts").mockResolvedValueOnce(products)
                let dbProduct = await productService.getAllProducts(siteId);
                expect(dbProduct).not.toBeNull();
                expect(dbProduct).toBe(products);

            });
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
                const mockProductType: ProductType = {
                    "productTypeName": "TestProduct",
                    "createdBy": 1,
                    "modifiedBy": 1,
                    "id": 1,
                    "createdAt": new Date("2021-07-14"),
                    "modifiedAt": new Date("2021-07-14")
                }
                let product: Product =
                {
                    id: 1,
                    name: 'Product One',
                    createdBy: 11,
                    modifiedBy: 11,
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    description: "",
                    cost: 5,
                    productStatus: 1,
                    siteId: 1,
                    productType: new ProductType(),
                    recurrence: false
                };
                const orderProducts = [{
                    id: 1,
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
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);

                jest.spyOn(orderProductRepository, 'find').mockResolvedValueOnce(orderProducts);
                if (product) {
                    product.productStatus = 99;
                    product.modifiedBy = req.user.id;
                    for await (const orderProduct of orderProducts) {
                        jest.spyOn(orderProductRepository, 'update').mockResolvedValueOnce(orderProduct);
                    }
                }
                jest.spyOn(productRepository, 'update').mockResolvedValueOnce(product);
                let result = await productService.softDeleteProduct(product.id, req, product.siteId);
                expect(await productRepository.findOne).toHaveBeenCalledWith(product.id);
                expect(result).not.toBeNull();
                expect(result).toBe(product);
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
            let product: Product =
            {
                id: 1,
                name: 'Product One',
                createdBy: 11,
                modifiedBy: 11,
                createdAt: new Date(),
                modifiedAt: new Date(),
                description: "",
                cost: 5,
                productStatus: 1,
                siteId: 1,
                productType: new ProductType(),
                recurrence: false
            };

            const payload = {
                id: 1,
                name: 'new',
                recurrence: true,
                cost: 100,
                description: 'new product launch',
                productTypeId: 1,
            } as UpdateProductDto;

            const orderProduct = [{
                id: 1,
                productName: 'New product',
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
                manuallyEnteredProduct: true,
                status: 1,
            }];
            const month = new Date().getMonth() + 2;
            it('should update the product data based on id and recurrence as true', async () => {
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);
                await productTypeRepository.find.mockReturnValue(payload);
                await orderProductRepository.find.mockReturnValue(orderProduct);

                for await (const orderProducts of orderProduct) {
                    // Update Order Product for next 1 month
                    if (orderProducts.id) {
                        orderProducts.productName = payload.name;
                        orderProducts.productDescription = payload.description;
                        orderProducts.cost = payload.cost;
                        orderProducts.recurrence = payload.recurrence;
                        await orderProductRepository.update(orderProducts.id, orderProducts);
                    }
                }
                jest.spyOn(productRepository, 'update').mockResolvedValueOnce(orderProduct);
                const products = await productService.updateProduct(product.id, payload, req, 1);
                expect(products).not.toBeNull();
                expect(products).toBe(orderProduct);

            });

            it('should update the product data based on id and recurrence as false', async () => {
                payload.recurrence = false as boolean;
                orderProduct[0].recurrence = false as boolean;
                jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(product);
                await productTypeRepository.find.mockReturnValue(payload);
                await orderProductRepository.find.mockReturnValue(orderProduct);

                for await (const orderProducts of orderProduct) {
                    // delete future months order products 
                    if (!payload.recurrence && (orderProducts.month != month)) {
                        await orderProductRepository.delete(orderProducts.id);
                    }
                    // Update Order Product for next 1 month
                    if (orderProducts.id) {
                        orderProducts.productName = payload.name;
                        orderProducts.productDescription = payload.description;
                        orderProducts.cost = payload.cost;
                        orderProducts.recurrence = payload.recurrence;
                        await orderProductRepository.update(orderProducts.id, orderProducts);
                    }
                }
                jest.spyOn(productRepository, 'update').mockResolvedValueOnce(orderProduct);
                const products = await productService.updateProduct(product.id, payload, req, 1);
                expect(products).not.toBeNull();
                expect(products).toBe(orderProduct);
            });

            it('it should throw exception if product id is not provided   ', async () => {
                jest.spyOn(productRepository, 'update').mockResolvedValueOnce('Product with provided id not available.');
                try {
                    await productService.updateProduct(product.id, payload, req, 1);
                } catch (e) {
                    expect(e.response.error).toBe('Not Acceptable');
                    expect(e.response.message).toBe('Product with provided id not available.');
                    expect(e.response.statusCode).toBe(406);
                }
            });
        });
    });

});