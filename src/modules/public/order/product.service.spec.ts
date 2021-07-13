import { Test } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './model/product.entity';
import { ProductType } from './model/product-type.entity';
import { OrderProduct } from './model/order-product.entity';
import { AddProductDto } from './dto/AddProduct.dto';

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

        it('should get all products', async () => {
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

        });
    });

})