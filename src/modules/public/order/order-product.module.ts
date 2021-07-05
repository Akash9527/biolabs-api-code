import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../../config';
import { OrderProduct } from './model/order-product.entity';
import { ProductType } from './model/product-type.entity';
import { Product } from './model/product.entity';
import { OrderProductController } from './order-product.controller';
import { OrderProductService } from './order-product.service';
import { ProductTypeController } from './product-type.controller';
import { ProductTypeService } from './product-type.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderProduct, Product, ProductType
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
  controllers: [OrderProductController, ProductController, ProductTypeController],
  exports: [OrderProductService, ProductService, ProductTypeService],
  providers: [OrderProductService, ProductService, ProductTypeService],
})
export class OrderProductModule { }