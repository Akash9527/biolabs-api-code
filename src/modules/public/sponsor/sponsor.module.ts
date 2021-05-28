import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { ConfigModule, ConfigService } from 'modules/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentCompany, ResidentCompanyModule } from '../resident-company';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResidentCompany,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          secret: process.env.APPSETTING_JWT_SECRET_KEY,
          signOptions: {
            ...(process.env.APPSETTING_JWT_EXPIRATION_TIME
              ? {
                expiresIn: Number(process.env.APPSETTING_JWT_EXPIRATION_TIME),
              }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
    ResidentCompanyModule,
    ConfigModule,
  ],
  controllers: [SponsorController],
  providers: [SponsorService]
})
export class SponsorModule {}
