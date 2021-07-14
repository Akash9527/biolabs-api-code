import { Test } from "@nestjs/testing";
import { ProductTypeService } from './product-type.service';
import { PassportModule } from "@nestjs/passport";
import { ProductType } from "./model/product-type.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AddProductTypeDto } from "./dto/AddProductType.dto";
describe('ProductTypeService', () => {
    let productTypeService: ProductTypeService;
    let productTypeRepository: Repository<ProductType>;

    const mockProductType: ProductType = {
        "productTypeName": "TestProduct",
        "createdBy": 1,
        "modifiedBy": 1,
        "id": 1,
        "createdAt": new Date("2021-07-14"),
        "modifiedAt": new Date("2021-07-14")
    }
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })
            ],
            providers: [
                ProductTypeService,
                {
                    provide: getRepositoryToken(ProductType),
                    useValue:
                    {
                        find: jest.fn(),
                        create: jest.fn(() => mockProductType),
                        save: jest.fn(),
                    }
                },

            ]
        }).compile();

        productTypeService = await module.get<ProductTypeService>(ProductTypeService);
        productTypeRepository = await module.get<Repository<ProductType>>(getRepositoryToken(ProductType));
    });
    it('it should be defined', () => {
        expect(productTypeService).toBeDefined();
    });
    describe(' test addProductType functionality', () => {
        const mockProductTypePayload: AddProductTypeDto = {
            "productTypeName": "TestProduct",
            "createdBy": 1,
            "modifiedBy": 1
        }
        it('should test addProductType method', async () => {
            jest.spyOn(productTypeRepository, 'save').mockResolvedValueOnce(mockProductType);
            const productTypes = await productTypeService.addProductType(mockProductTypePayload);
            expect(productTypes).not.toBeNull();
            expect(mockProductType.productTypeName).toEqual(productTypes.productTypeName);
            expect(mockProductType.createdBy).toEqual(productTypes.createdBy);
            expect(mockProductType.modifiedBy).toEqual(productTypes.modifiedBy);

        })

    });
    describe(' test getProductType functionality', () => {
        const mockProductType2 = {
            "id": 2,
            "productTypeName": "Lab Bench",
            "createdBy": 1,
            "modifiedBy": 1,
            "createdAt": "2021-07-06T11:23:14.174Z",
            "modifiedAt": "2021-07-06T11:23:14.174Z"
        }
        let producttypes: Array<any> = [{ mockProductType, mockProductType2 }];
        it('should test getProductType method', async () => {
            jest.spyOn(productTypeRepository, 'find').mockResolvedValueOnce(producttypes);
            const productTypes = await productTypeService.getProductType();
            expect(productTypes).not.toBeNull();
            expect(productTypes.length).toBe(producttypes.length);
            expect(productTypes[0]).toBe(producttypes[0]);
            expect(productTypes).toBe(producttypes);
        })

    });

});