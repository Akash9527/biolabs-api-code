import { Controller, Get, Header, Post, Query, Res, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
  constructor(private readonly appService: FileService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('myfile'))
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(@UploadedFile() file: Express.Multer.File):Promise<string>{
    await this.appService.upload(file);
    return "uploaded";
  }

  @Get('read-image')
  @Header('Content-Type','image/webp')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async readImage(@Res() res,@Query('filename') filename){
    const file = await this.appService.getfileStream(filename);
    return file.pipe(res);
  }

  @Get('download-image')
  @Header('Content-Type','image/webp')
  @Header('Content-Disposition', 'attachment; filename=test.webp')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async downloadImage(@Res() res,@Query('filename') filename){
    const file = await this.appService.getfileStream(filename);
    return file.pipe(res);
  }

  @Get('delete-image')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Query('filename') filename){
    await this.appService.delete(filename);
    return "deleted";
  }
}
