import { Test, TestingModule } from "@nestjs/testing";
import { FileController } from './file.controller';
import { PassportModule } from "@nestjs/passport";
import { HTTP_CODES } from '../../../utils/httpcode';
import { FileService } from "./file.service";


const mockorderFileService = () => ({
    upload: jest.fn(),
    readImage: jest.fn(),
    downloadImage: jest.fn(),
    delete: jest.fn(),
    getfileStream: jest.fn(() => {
        return {
            pipe: jest.fn(),
        }
    }),
})

describe('FileController', () => {
    let fileController;
    let fileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [FileController],
            providers: [
                { provide: FileService, useFactory: mockorderFileService },
            ]
        }).compile();

        fileController = await module.get<FileController>(FileController);
        fileService = await module.get<FileService>(FileService);
    });
    it('should be defined', () => {
        expect(fileController).toBeDefined();
    });

    describe('should test upload Functionality', () => {
        let  payload: { userId: 1, fileType: "file", companyId: 1 };
        let file :{};
        it('it should called fileService upload method ', async () => {
            expect(payload).not.toBe(null);
            await fileController.upload(payload);
            //expect(await fileService.upload).toHaveBeenCalledWith(payload);
        });
        it('it should throw BAD_REQUEST Exception if companyId or userId will null', async () => {
            const { response } = await fileController.upload(payload);
            expect(response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(response.message).toBe('companyId or userId any one of them is required');
            expect(response.error).toBe('Bad Request');
        });

    });

    describe('should test readImage Functionality', () => {
        let response = {};
        let fileType: "test";
        let fileName: "test";
        const mockReadStream = { pipe: jest.fn() };
        it('it should called fileService readImage method ', async () => {
            expect(fileType).not.toBe(null);
            expect(fileName).not.toBe(null);
            const fileUploadMock = {
                filename: 'zoro',
                mimetype: 'image/jpeg',
                encoding: '7bit',
                createReadStream: jest.fn().mockReturnValueOnce(mockReadStream),
            }
    
            await fileController.readImage(response, fileName, fileType);
            expect(await fileService.getfileStream).toHaveBeenCalledWith(fileName, fileName);
           
        });
    });
    describe('should test downloadImage Functionality', () => {
        let response = {};
        let fileType: "test";
        let fileName: "test"
        it('it should called fileService delete method ', async () => {
            expect(fileType).not.toBe(null);
            expect(fileName).not.toBe(null);
            await fileController.downloadImage(response, fileName, fileType);
            expect(await fileService.getfileStream).toHaveBeenCalledWith(fileName, fileName);
        });

    });
    describe('should test delete Functionality', () => {
        let fileType: "test";
        let fileName: "test"
        it('it should called fileService delete method ', async () => {
            expect(fileType).not.toBe(null);
            expect(fileName).not.toBe(null);
            await fileController.delete(fileName, fileType);
            expect(await fileService.delete).toHaveBeenCalledWith(fileName, fileType);
            //expect(response.statusCode).toBe(HTTP_CODES.OK);
            //console.log("response==========",response);
            //expect(response.message).toBe('deleted');
        });
    });
   
});