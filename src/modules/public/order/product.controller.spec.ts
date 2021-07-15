import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PassportModule } from "@nestjs/passport";
import { AddProductDto } from "./dto/AddProduct.dto";
import { UnauthorizedException } from "@nestjs/common";
import { HTTP_CODES } from '../../../utils/httpcode';
import { UpdateProductDto } from "./dto/UpdateProduct.dto";
const mockProductService = () => ({
    addProduct: jest.fn(),
    getAllProducts: jest.fn(),
    softDeleteProduct: jest.fn(),
    getProductsByName: jest.fn(),
    updateProduct: jest.fn()
})
const req: any = {
    user: { site_id: [1, 2] },
    headers: { 'x-site-id': [2] }
}
let siteIdArr: any;
let site_id: any;
const mockProduct = {

    "name": "test1",
    "description": "this is test 1",
    "recurrence": true,
    "cost": 120,
    "createdBy": 1,
    "modifiedBy": 1,
    "siteId": [2],
    "id": 1,
    "productStatus": 1,
    "createdAt": "2021-06-25T11:37:56.653Z",
    "modifiedAt": "2021-06-25T11:37:56.653Z"
}

describe('ProductController', () => {

    let productController;
    let productService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })],

            controllers: [ProductController],
            providers: [
                { provide: ProductService, useFactory: mockProductService },
            ]
        }).compile();

        productController = await module.get<ProductController>(ProductController);
        productService = await module.get<ProductService>(ProductService);

    });

    it('should be defined', () => {
        expect(productController).toBeDefined();
    });
    describe('test add product Functionality', () => {
        const mockPayload: AddProductDto = { name: "test1", recurrence: true, cost: 120, description: "this is test 1", productTypeId: 1 };

        it('it should call productService addProduct method', async () => {
            //check function is called or not
            await productController.addProduct(mockPayload, req);
            siteIdArr = req.user.site_id;
            site_id = JSON.parse(req.headers['x-site-id'].toString());
            expect(await productService.addProduct).toHaveBeenCalledWith(mockPayload, req, site_id);

        });
        it('it should return  product object ', async () => {
            //return product objects
            await productService.addProduct.mockResolvedValue(mockProduct);
            let products = await productController.addProduct(mockPayload, req, site_id);
            expect(products).not.toBeNull();
            expect(mockProduct.name).toEqual(products.name);
            expect(mockProduct.description).toEqual(products.description);
            expect(mockProduct.cost).toBe(products.cost);
            expect(mockProduct.recurrence).toBeTruthy();
        });


        it('test product request with Unauthorized', async () => {
            await productService.addProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await productController.addProduct(mockPayload, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('test fetchALLProducts Functionality', () => {

        it('it should call productService fetchALLProducts method', async () => {
            //check function is called or not
            await productController.fetchALLProducts(req);
            siteIdArr = req.user.site_id;
            siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            if (siteIdArr.length > 0) {
                expect(await productService.getAllProducts).toHaveBeenCalledWith(siteIdArr);
            }

        });
        it('it should return  product object ', async () => {
            const mockProduct2 = {
                "name": "testProduct2",
                "description": "this is test 1",
                "recurrence": true,
                "cost": 120,
                "createdBy": 1,
                "modifiedBy": 1,
                "siteId": [2],
                "id": 2,
                "productStatus": 1,
                "createdAt": "2021-06-25T11:37:56.653Z",
                "modifiedAt": "2021-06-25T11:37:56.653Z"
            }
            let fetchProducts: Array<any> = [{ mockProduct, mockProduct2 }];
            siteIdArr = req.user.site_id;
            siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            await productService.getAllProducts.mockResolvedValueOnce(fetchProducts);

        });

    });
    describe('test delete product Functionality', () => {
        it('it should call productService deleteProduct method', async () => {
            //check function is called or not
            await productController.deleteProduct(mockProduct.id, req);
            expect(await productService.softDeleteProduct).toHaveBeenCalledWith(mockProduct.id, req);

        });
        it('test product request with Unauthorized', async () => {
            await productService.softDeleteProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await productController.deleteProduct(mockProduct.id, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('test fetch product by name Functionality', () => {

        it('it should call productService getProductsByName method', async () => {
            //check function is called or not
            await productController.fetchProducts(mockProduct.name, req);
            siteIdArr = req.user.site_id;
            site_id = JSON.parse(req.headers['x-site-id'].toString());
            expect(await productService.getProductsByName).toHaveBeenCalledWith(mockProduct.name, site_id);
        });
        it('test product request with Unauthorized', async () => {
            await productService.getProductsByName.mockResolvedValue(new UnauthorizedException());
            const { response } = await productController.fetchProducts(mockProduct.name, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('test updateProduct Functionality', () => {
        const mockUpdatePayload: UpdateProductDto = { name: "test1", recurrence: true, cost: 100, description: "this is test 1", productTypeId: 1 };
        it('it should call productService updateProduct method', async () => {
            //check function is called or not
            await productController.updateProduct(mockProduct.id, mockUpdatePayload, req);
            siteIdArr = req.user.site_id;
            site_id = JSON.parse(req.headers['x-site-id'].toString());
            expect(await productService.updateProduct).toHaveBeenCalledWith(mockProduct.id, mockUpdatePayload, req, site_id);
        });
        it('test product request with Unauthorized', async () => {
            await productService.updateProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await productController.updateProduct(mockProduct.id, mockUpdatePayload, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
});