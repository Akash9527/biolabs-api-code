import { Controller, Get, Header, Post, Query, Body, Res, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UploadPayload } from './upload-file.payload';
import { createParamDecorator } from '@nestjs/swagger/dist/decorators/helpers';

export const ApiFile = (fileName: string = 'myfile'): MethodDecorator => (
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
  constructor(private readonly fileService: FileService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('myfile'))
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiQuery({ name: 'userId', required: true, type: 'number'})
  @ApiQuery({ name: 'userType', required: true, type: 'string'})
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(@Query() payload:{userId:number, userType:string}, @UploadedFile() file: Express.Multer.File):Promise<string>{
    console.log("payload",payload);
    await this.fileService.upload(file, payload);
    return "uploaded";
  }

  @Get('read-image')
  @Header('Content-Type','image/webp')
  @ApiQuery({ name: 'filename', type: String })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async readImage(@Res() res,@Query('filename') filename){
    const file = await this.fileService.getfileStream(filename);
    return file.pipe(res);
  }

  @Get('download-image')
  @Header('Content-Type','image/webp')
  @Header('Content-Disposition', 'attachment; filename=test.webp')
  @ApiQuery({ name: 'filename', type: String })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async downloadImage(@Res() res,@Query('filename') filename){
    const file = await this.fileService.getfileStream(filename);
    return file.pipe(res);
  }

  @Get('delete-image')
  @ApiQuery({ name: 'filename', type: String })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Query('filename') filename){
    await this.fileService.delete(filename);
    return "deleted";
  }
}
