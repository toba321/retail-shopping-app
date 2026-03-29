import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { DiscountsService } from '../discounts/discounts.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CheckoutService {
  constructor(
    private cartService: CartService,
    private discountsService: DiscountsService,
    private productsService: ProductsService,
  ) { }

  async processCheckout(userId: string, discountCode?: string) {
    // Load current cart snapshot for checkout validation.
    const cart = this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Your cart is empty. Please add items before checkout.');
    }

    // Ensure every requested quantity is still available before payment is accepted.
    for (const item of cart.items) {
      const product = this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }
    }

    // Payment is simulated with a failure branch so the app can surface retry flows.
    const paymentSuccess = Math.random() > 0.2;
    if (!paymentSuccess) {
      throw new BadRequestException('Payment failed. Please try again or use a different payment method.');
    }

    // Deduct stock only after a successful payment result.
    for (const item of cart.items) {
      this.productsService.updateStock(item.productId, -item.quantity);
    }

    // Calculate order subtotal from current cart lines.
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += (item.price || 0) * item.quantity;
    });

    // Apply the discount code selected by the client when provided.
    let discountApplied = 0;
    let appliedDiscountCode: string | null = null;
    let appliedDiscountDescription: string | null = null;

    if (discountCode) {
      const discount = await this.discountsService.findOne(discountCode);
      if (!discount) {
        throw new BadRequestException(`Invalid discount code: ${discountCode}`);
      }

      if (discount.minGuideline && subtotal < discount.minGuideline) {
        throw new BadRequestException(
          `Discount ${discount.id} requires a minimum subtotal of ${discount.minGuideline}`,
        );
      }

      if (discount.type === 'PERCENTAGE') {
        const rawRate = discount.value || 0;
        const rate = rawRate > 1 ? rawRate / 100 : rawRate;
        discountApplied = Math.round(subtotal * rate * 100) / 100;
      } else if (discount.type === 'FIXED') {
        discountApplied = Math.min(discount.value || 0, subtotal);
      }

      appliedDiscountCode = discount.id;
      appliedDiscountDescription = discount.description;
    }

    // Cart is cleared after checkout attempt completes successfully.
    this.cartService.clearCart(userId);

    // Return a complete order summary for UI confirmation.
    return {
      orderId: `ORD-${Math.random().toString(36).toUpperCase().substring(7)}`,
      user: userId,
      items: cart.items,
      subtotal: subtotal,
      discountApplied: discountApplied,
      appliedDiscountCode,
      appliedDiscountDescription,
      total: subtotal - discountApplied,
      status: 'SUCCESS',
      message: 'Thank you for your purchase!'
    };
  }
}