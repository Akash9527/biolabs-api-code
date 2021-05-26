import { Module } from '@nestjs/common';
import { UserModule } from '../user';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    UserModule
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule { }