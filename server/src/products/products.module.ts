import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [DiscountsModule],
  exports: [ProductsService]
})
export class ProductsModule {}
