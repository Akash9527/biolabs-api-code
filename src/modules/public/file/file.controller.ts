import { BadRequestException, Controller, Get, Header, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

export const ApiFile = (fileName = 'myfile'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
@Controller('api/file')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) { }


  @Post('upload')
  @UseInterceptors(FileInterceptor('myfile'))
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiQuery({ name: 'userId', required: false, type: 'number' })
  @ApiQuery({ name: 'companyId', required: false, type: 'number' })
  @ApiQuery({ name: 'imgType', required: true, type: 'string' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(@Query() payload: { userId: number, imgType: string, companyId : number }, @UploadedFile() file: Express.Multer.File): Promise<object> {
    if(payload && (payload.userId || payload.companyId)){
      return await this.fileService.upload(file, payload);
    }else{
      return new BadRequestException('companyId or userId any one of them is required');
    }
  }

  @Get('read-image')
  @Header('Content-Type', 'image/webp')
  @ApiQuery({ name: 'filename', type: String })
  @ApiQuery({ name: 'imgType', required: true, type: 'string' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async readImage(@Res() res, @Query('filename') filename, @Query('imgType') imgType) {
    const file = await this.fileService.getfileStream(filename, imgType);
    return file.pipe(res);
  }

  @Get('download-image')
  @Header('Content-Type', 'image/webp')
  @Header('Content-Disposition', 'attachment; filename=test.webp')
  @ApiQuery({ name: 'filename', type: String })
  @ApiQuery({ name: 'imgType', required: true, type: 'string' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async downloadImage(@Res() res, @Query('filename') filename, @Query('imgType') imgType) {
    const file = await this.fileService.getfileStream(filename, imgType);
    return file.pipe(res);
  }

  @Get('delete-image')
  @ApiQuery({ name: 'filename', type: String })
  @ApiQuery({ name: 'imgType', required: true, type: 'string' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Query('filename') filename, @Query('imgType') imgType) {
    await this.fileService.delete(filename, imgType);
    return "deleted";
  }
}