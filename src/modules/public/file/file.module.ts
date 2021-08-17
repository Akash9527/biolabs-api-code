import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ResidentCompanyModule } from '../resident-company';
import { UserModule } from '../user';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    UserModule,
    ResidentCompanyModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }