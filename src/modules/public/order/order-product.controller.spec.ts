import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { HTTP_CODES } from '../../../utils/httpcode';
import { CreateOrderProductDto } from './dto/order-product.create.dto';
import { UpdateOrderProductDto } from './dto/order-product.update.dto';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { PassportModule } from "@nestjs/passport";
import { OrderProduct } from "./model/order-product.entity";
const mockorderProductService = () => ({
    addOrderProduct: jest.fn(),
    updateOrderProduct: jest.fn(),
    fetchOrderProductsBetweenDates: jest.fn(),
    deleteOrderProduct: jest.fn(),
    consolidatedInvoice: jest.fn(),
})
const mockOrderProduct: OrderProduct = {
    id: 1,
    companyId: 1, productName: 'TestProduct', productDescription: 'This is TestProduct 1',
    startDate: new Date("2021-08-2"), endDate: new Date("2021-08-18"),
    month: 7, year: 2021, quantity: 10, cost: 90, recurrence: true,
    currentCharge: true, status: 1, manuallyEnteredProduct: false, productId: 10,
    createdAt: 2021, updatedAt: 2021
}
describe('OrderProductController', () => {
    let orderProductController;
    let orderProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [OrderProductController],
            providers: [
                { provide: OrderProductService, useFactory: mockorderProductService },
            ]
        }).compile();

        orderProductController = await module.get<OrderProductController>(OrderProductController);
        orderProductService = await module.get<OrderProductService>(OrderProductService);
    });

    it('should be defined', () => {
        expect(orderProductController).toBeDefined();
    });
    describe('should test addOrderProduct Functionality', () => {
        let mockCreateOrderProductPayload: CreateOrderProductDto = {
            companyId: 1, productName: 'TestProduct', productDescription: 'This is TestProduct 1',
            startDate: '2021-08-02', endDate: '2021-08-18',
            month: 7, year: 2021, quantity: 10, cost: 90, recurrence: true,
            currentCharge: true, status: 1, manuallyEnteredProduct: false, productId: 10
        };
        it('it should called orderProductService addOrderProduct method ', async () => {
            expect(mockCreateOrderProductPayload).not.toBe(null);
            await orderProductController.addOrderProduct(mockCreateOrderProductPayload);
            expect(await orderProductService.addOrderProduct).toHaveBeenCalledWith(mockCreateOrderProductPayload);
        });
        it('it should return  orderProduct object ', async () => {
            await orderProductService.addOrderProduct.mockResolvedValue(mockOrderProduct);
            let orderProducts = await await orderProductController.addOrderProduct(mockCreateOrderProductPayload);
            expect(orderProducts).not.toBeNull();
            expect(mockOrderProduct.productName).toEqual(orderProducts.productName);
            expect(mockOrderProduct.quantity).toEqual(orderProducts.quantity);
            expect(mockOrderProduct.cost).toEqual(orderProducts.cost);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            orderProductService.addOrderProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await orderProductController.addOrderProduct();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });

    });
    describe('should test updateOrderProduct Functionality', () => {
        let mockUpdateOrderProductPayload: UpdateOrderProductDto = {
            productName: 'TestProduct', productDescription: 'This is TestProduct 1',
            startDate: '2021-08-02', endDate: '2021-08-18',
            month: 7, year: 2021, quantity: 20, cost: 100, recurrence: true,
            currentCharge: true, manuallyEnteredProduct: false, productId: 10,
        };
        it('it should called orderProductService updateOrderProduct method ', async () => {
            expect(mockUpdateOrderProductPayload).not.toBe(null);
            await orderProductController.updateOrderProduct(mockOrderProduct.id, mockUpdateOrderProductPayload);
            expect(await orderProductService.updateOrderProduct).toHaveBeenCalledWith(mockOrderProduct.id, mockUpdateOrderProductPayload);
        });
        it('it should return  orderProduct object ', async () => {
            mockOrderProduct.cost = mockUpdateOrderProductPayload.cost;
            mockOrderProduct.quantity = mockUpdateOrderProductPayload.quantity;
            await orderProductService.updateOrderProduct.mockResolvedValue(mockOrderProduct);
            let orderProducts = await orderProductController.updateOrderProduct(mockOrderProduct.id, mockUpdateOrderProductPayload);
            expect(orderProducts).not.toBeNull();
            expect(mockOrderProduct.productName).toEqual(orderProducts.productName);
            expect(mockOrderProduct.quantity).toEqual(orderProducts.quantity);
            expect(mockOrderProduct.cost).toEqual(orderProducts.cost);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            orderProductService.updateOrderProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await orderProductController.updateOrderProduct();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test fetchOrderProductsBetweenDates Functionality', () => {
        it('it should called orderProductService fetchOrderProductsBetweenDates method ', async () => {
            await orderProductController.fetchOrderProductsBetweenDates(mockOrderProduct.companyId, mockOrderProduct.month);
            expect(await orderProductService.fetchOrderProductsBetweenDates).toHaveBeenCalledWith( mockOrderProduct.month,mockOrderProduct.companyId);
        });
        it('it should return  orderProduct object  based on month and Company Id ', async () => {
            const mockOrderProduct2 = {
                id: 1,
                companyId: 1, productName: 'TestProduct', productDescription: 'This is TestProduct 1',
                startDate: new Date("2021-08-2"), endDate: new Date("2021-08-18"),
                month: 7, year: 2021, quantity: 10, cost: 90, recurrence: true,
                currentCharge: true, status: 1, manuallyEnteredProduct: false, productId: 10,
                createdAt: 2021, updatedAt: 2021
            }
            let fetchOrderProducts: Array<any> = [{ mockOrderProduct, mockOrderProduct2 }];
            await orderProductService.fetchOrderProductsBetweenDates.mockResolvedValueOnce(fetchOrderProducts);
            let orderProducts=await orderProductController.fetchOrderProductsBetweenDates(mockOrderProduct.companyId, mockOrderProduct.month);
            expect(orderProducts).not.toBeNull();
            expect(orderProducts.length).toBe(fetchOrderProducts.length);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            orderProductService.fetchOrderProductsBetweenDates.mockResolvedValue(new UnauthorizedException());
            const { response } = await orderProductController.fetchOrderProductsBetweenDates(mockOrderProduct.companyId, mockOrderProduct.month);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test deleteOrderProduct Functionality', () => {
        it('it should called orderProductService deleteOrderProduct method ', async () => {
            await orderProductController.deleteOrderProduct(mockOrderProduct.id);
            expect(await orderProductService.deleteOrderProduct).toHaveBeenCalledWith(mockOrderProduct.id);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            orderProductService.deleteOrderProduct.mockResolvedValue(new UnauthorizedException());
            const { response } = await orderProductController.deleteOrderProduct();
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
    describe('should test consolidatedInvoice Functionality', () => {
        const req: any = {
            user: { site_id: [1, 2] },
            headers: { 'x-site-id': [2] }
        }
        let siteIdArr: any;
        it('it should called orderProductService consolidatedInvoice method ', async () => {
            await orderProductController.consolidatedInvoice(mockOrderProduct.month, req);
            siteIdArr = req.user.site_id;
            siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
            expect(await orderProductService.consolidatedInvoice).toHaveBeenCalledWith(mockOrderProduct.month, siteIdArr);
        });
        it('it should return  orderProduct object  based on month ', async () => {
            const mockOrderProduct2 = {
                id: 1,
                companyId: 1, productName: 'TestProduct', productDescription: 'This is TestProduct 1',
                startDate: new Date("2021-08-2"), endDate: new Date("2021-08-18"),
                month: 7, year: 2021, quantity: 10, cost: 90, recurrence: true,
                currentCharge: true, status: 1, manuallyEnteredProduct: false, productId: 10,
                createdAt: 2021, updatedAt: 2021
            }
            let consolidatedProducts: Array<any> = [{ mockOrderProduct, mockOrderProduct2 }];
            await orderProductService.consolidatedInvoice.mockResolvedValueOnce(consolidatedProducts);
            let orderProducts=await orderProductController.consolidatedInvoice(mockOrderProduct.month, req);
            expect(orderProducts).not.toBeNull();
            expect(orderProducts.length).toBe(consolidatedProducts.length);
        });
        it('it should throw UnAuthorized Exception if user is not authorized', async () => {
            orderProductService.consolidatedInvoice.mockResolvedValue(new UnauthorizedException());
            const { response } = await orderProductController.consolidatedInvoice(mockOrderProduct.month, req);
            expect(response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
            expect(response.message).toBe('Unauthorized');
        });
    });
});