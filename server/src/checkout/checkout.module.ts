import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { DiscountsModule } from '../discounts/discounts.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';

@Module({
  providers: [CheckoutService],
  controllers: [CheckoutController],
  imports: [DiscountsModule, CartModule, ProductsModule]
})
export class CheckoutModule {}
