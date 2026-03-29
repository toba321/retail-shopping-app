import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  async getAllDiscounts() {
    /**
     * Lists all active promotional discount types.
     * Seeded with a variety of retail-relevant types (e.g., BOGOF, Percentage).
     */
    return this.discountsService.findAll(); 
  }

  @Get(':id')
  async getDiscountDetails(@Param('id') id: string) {
    /**
     * Retrieves specific details for a discount.
     * Useful for showing "Terms & Conditions" or specific logic in the app.
     */
    const discount = await this.discountsService.findOne(id); 
    
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`); 
    }
    
    return discount;
  }
}