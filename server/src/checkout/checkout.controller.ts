import { Controller, Post, Headers, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async processCheckout(
    @Headers('authorization') authHeader: string,
    @Body() body: { discountCode?: string }
  ) {
    // Authentication is out of scope, so requests are mapped to a single demo user.
    const userId = 'current-user';

    return this.checkoutService.processCheckout(userId, body.discountCode);
  }
}