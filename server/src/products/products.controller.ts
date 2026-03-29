import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DiscountsService } from '../discounts/discounts.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly discountsService: DiscountsService,
  ) {}

  @Get()
  async getAllProducts() {
    // Returns products with name, price, and current stock 
    return this.productsService.findAll();
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    // Returns full details for a specific product 
    return this.productsService.findOne(id);
  }

  @Get('discounts')
  async getAllDiscounts() {
    // Lists active promotional discount types 
    return this.discountsService.findAll();
  }
}