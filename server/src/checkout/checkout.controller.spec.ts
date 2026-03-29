import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';

describe('CheckoutController', () => {
  let controller: CheckoutController;
  let checkoutService: jest.Mocked<CheckoutService>;

  beforeEach(async () => {
    const mockProductsService = {
      findOne: jest.fn(),
      updateStock: jest.fn(),
    };

    const mockDiscountsService = {
      findAll: jest.fn(),
    };

    const mockCartService = {
      getCart: jest.fn(),
      clearCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        CheckoutService,
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
        {
          provide: DiscountsService,
          useValue: mockDiscountsService,
        },
      ],
    }).compile();

    controller = module.get<CheckoutController>(CheckoutController);
    checkoutService = module.get(CheckoutService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('uses current-user and forwards discount code to service', async () => {
    checkoutService.processCheckout = jest.fn().mockResolvedValue({ status: 'SUCCESS' });

    await controller.processCheckout('Bearer token', { discountCode: 'D1' });

    expect(checkoutService.processCheckout).toHaveBeenCalledWith('current-user', 'D1');
  });
});
