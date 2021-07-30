import { Module } from '@nestjs/common';
import { ResidentCompanyModule, ResidentCompanyService } from '../resident-company';
import { UserModule, UsersService } from '../user';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    UserModule,
    ResidentCompanyModule
  ],
  controllers: [FileController],
  providers: [FileService,ResidentCompanyService,UsersService],
  exports: [FileService],
})
export class FileModule { }