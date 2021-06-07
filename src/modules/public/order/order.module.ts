import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { Invoice } from './model/invoice.entity';
import { OrderProduct } from './model/order-product.entity';
import { Order } from './model/order.entity';
import { OrderProductController } from './order.controller';
import { OrderProductService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderProduct,
      Invoice
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
  controllers: [OrderProductController],
  exports: [OrderProductService],
  providers: [OrderProductService],
})
export class OrderProductModule {}