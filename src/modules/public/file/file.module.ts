import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../../config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user';
import { Mail } from 'utils/Mail';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),],
  controllers: [FileController],
  providers: [FileService],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' }), FileService],
})
export class FileModule {}
