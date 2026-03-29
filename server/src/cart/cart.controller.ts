import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Retrieves the current state of the cart, including 
   * calculated totals and the countdown timer.
   */
  @Get()
  async getMyCart() {
    return this.cartService.getCart('current-user');
  }

  /**
   * Adds a product to the cart and starts/resets the 2-minute reservation.
   */
  @Post('items')
  async addItem(@Body() dto: { productId: string; quantity: number }) {
    await this.cartService.addToCart('current-user', dto.productId, dto.quantity);
    return this.cartService.getCart('current-user');
  }

  /**
   * Updates the specific quantity of a product key in the JSON object.
   * Logic for stock adjustment is handled internally in the Service.
   */
  @Put('items/:productId')
  async updateQuantity(
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    await this.cartService.updateQuantity('current-user', productId, body.quantity);
    return this.cartService.getCart('current-user');
  }

  /**
   * Deletes the product key from the cart and releases its specific stock.
   */
  @Delete('items/:productId')
  async removeItem(@Param('productId') productId: string) {
    await this.cartService.removeFromCart('current-user', productId);
    return this.cartService.getCart('current-user');
  }

  /**
   * Manually clears the cart (e.g., a "Cancel Order" button).
   * This calls the internal logic to release all held stock.
   */
  @Delete()
  async clearCart() {
    this.cartService.clearCartInternal('current-user');
    return { message: 'Cart cleared and stock released' };
  }
}