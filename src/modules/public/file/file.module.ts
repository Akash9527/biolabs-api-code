import { Module } from '@nestjs/common';
import { ConfigModule } from 'modules/config';
import { UserModule } from '../user';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    UserModule,
    ConfigModule
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
