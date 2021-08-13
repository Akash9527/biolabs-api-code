import { Test, TestingModule } from "@nestjs/testing";
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from "./product-type.controller";
import { PassportModule } from "@nestjs/passport";
import { ProductType } from "./model/product-type.entity";
import { UnauthorizedException } from "@nestjs/common";
import { HTTP_CODES } from '../../../utils/httpcode';
import { AddProductTypeDto } from "./dto/AddProductType.dto";
const mockProductTypeService = () => ({
    addProductType: jest.fn(),
    getProductType: jest.fn(),
})

const mockProductType: ProductType = {
    "productTypeName": "TestProduct",
    "createdBy": 1,
    "modifiedBy": 1,
    "id": 1,
    "createdAt": new Date("2021-07-14"),
    "modifiedAt": new Date("2021-07-14")
}
const req: any = {
    user: { id: 1 }
}
describe('ProductTypeController', () => {

    let productTypeController;
    let productTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })],

            controllers: [ProductTypeController],
            providers: [
                { provide: ProductTypeService, useFactory: mockProductTypeService },
            ]
        }).compile();

        productTypeController = await module.get<ProductTypeController>(ProductTypeController);
        productTypeService = await module.get<ProductTypeService>(ProductTypeService);

    });

    it('should be defined', () => {
        expect(productTypeController).toBeDefined();
    });
    describe('test add product Functionality', () => {
        const mockProductTypePayload: AddProductTypeDto = {
            "productTypeName": "TestProduct",
            "createdBy": 1,
            "modifiedBy": 1
        }

        it('it should call productTypeService addOrderProduct method', async () => {
            //check function is called or not
            await productTypeController.addOrderProduct(mockProductTypePayload, req);
            mockProductTypePayload.createdBy = req.user.id;
            mockProductTypePayload.modifiedBy = req.user.id;
            expect(await productTypeService.addProductType).toHaveBeenCalledWith(mockProductTypePayload);

        });
        it('it should return  productType object ', async () => {
            //return productType objects
            await productTypeService.addProductType.mockResolvedValue(mockProductType);
            let productTypes = await await productTypeController.addOrderProduct(mockProductTypePayload, req);
            expect(productTypes).not.toBeNull();
            expect(mockProductType.productTypeName).toEqual(productTypes.productTypeName);
            expect(mockProductType.createdBy).toEqual(productTypes.createdBy);
            expect(mockProductType.modifiedBy).toEqual(productTypes.modifiedBy);

        });


        it('test product request with Unauthorized', async () => {
            await productTypeService.addProductType.mockResolvedValue(new UnauthorizedException());
            const { response } = await productTypeController.addOrderProduct(mockProductTypePayload, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('test fetchOrderProducts  Functionality', () => {
        const mockProductType2 = {
            "id": 2,
            "productTypeName": "Lab Bench",
            "createdBy": 1,
            "modifiedBy": 1,
            "createdAt": "2021-07-06T11:23:14.174Z",
            "modifiedAt": "2021-07-06T11:23:14.174Z"
        }
        let producttypes: Array<any> = [{ mockProductType, mockProductType2 }];

        it('it should call productTypeService getProductType method', async () => {
            //check function is called or not
            await productTypeController.fetchOrderProducts();
            expect(await productTypeService.getProductType).toHaveBeenCalledWith();

        });
        it('it should return  productType object ', async () => {
            //return productType objects
            await productTypeService.getProductType.mockResolvedValue(producttypes);
            let productsTypes = await await productTypeController.fetchOrderProducts();
            expect(productsTypes).not.toBeNull();
            expect(productsTypes.length).toBe(producttypes.length);
            expect(productsTypes[0]).toBe(producttypes[0]);
            expect(productsTypes).toBe(producttypes);
        });

        it('test product request with Unauthorized', async () => {
            await productTypeService.getProductType.mockResolvedValue(new UnauthorizedException());
            const { response } = await productTypeController.fetchOrderProducts();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
});