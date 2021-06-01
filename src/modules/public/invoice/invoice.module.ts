import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { OrderProduct } from './model/order-product.entity';
import { Order } from './model/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderProduct
    ]),
    ConfigModule,
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
  ],
  controllers: [InvoiceController],
  exports: [InvoiceService],
  providers: [InvoiceService],
})
export class InvoiceModule {}