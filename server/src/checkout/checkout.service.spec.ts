import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from '../discounts/discounts.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let cartService: jest.Mocked<CartService>;
  let productsService: jest.Mocked<ProductsService>;
  let discountsService: jest.Mocked<DiscountsService>;

  beforeEach(async () => {
    const mockCartService = {
      getCart: jest.fn(),
      clearCart: jest.fn(),
    };

    const mockProductsService = {
      findOne: jest.fn(),
      updateStock: jest.fn(),
    };

    const mockDiscountsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CheckoutService>(CheckoutService);
    cartService = module.get(CartService);
    productsService = module.get(ProductsService);
    discountsService = module.get(DiscountsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('fails when cart is empty', async () => {
    cartService.getCart.mockReturnValue({ items: [], total: 0, expires_at: null });

    await expect(service.processCheckout('current-user')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('fails checkout when stock is insufficient', async () => {
    cartService.getCart.mockReturnValue({
      items: [{ productId: '1', name: 'Headphones', price: 199.99, quantity: 3 }],
      total: 599.97,
      expires_at: '2026-01-01T00:00:00.000Z',
    });
    productsService.findOne.mockReturnValue({ id: '1', name: 'Headphones', price: 199.99, stock: 1 });

    await expect(service.processCheckout('current-user')).rejects.toBeInstanceOf(BadRequestException);
    expect(productsService.updateStock).not.toHaveBeenCalled();
    expect(cartService.clearCart).not.toHaveBeenCalled();
  });

  it('completes checkout, consumes stock, applies valid discount, and clears cart', async () => {
    cartService.getCart.mockReturnValue({
      items: [{ productId: '1', name: 'Headphones', price: 200, quantity: 1 }],
      total: 200,
      expires_at: '2026-01-01T00:00:00.000Z',
    });
    productsService.findOne.mockReturnValue({ id: '1', name: 'Headphones', price: 200, stock: 5 });
    discountsService.findOne.mockResolvedValue({
      id: 'D1',
      description: '10% off orders over £100',
      type: 'PERCENTAGE',
      value: 0.1,
      minGuideline: 100,
    });
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const result = await service.processCheckout('current-user', 'D1');

    expect(productsService.updateStock).toHaveBeenCalledWith('1', -1);
    expect(cartService.clearCart).toHaveBeenCalledWith('current-user');
    expect(result.status).toBe('SUCCESS');
    expect(result.discountApplied).toBe(20);
    expect(result.appliedDiscountCode).toBe('D1');
    expect(result.total).toBe(180);
  });

  it('fails when discount code does not exist', async () => {
    cartService.getCart.mockReturnValue({
      items: [{ productId: '1', name: 'Headphones', price: 100, quantity: 1 }],
      total: 100,
      expires_at: '2026-01-01T00:00:00.000Z',
    });
    productsService.findOne.mockReturnValue({ id: '1', name: 'Headphones', price: 100, stock: 3 });
    discountsService.findOne.mockResolvedValue(undefined);
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    await expect(service.processCheckout('current-user', 'BAD')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('fails when discount exists but minimum spend is not met', async () => {
    cartService.getCart.mockReturnValue({
      items: [{ productId: '1', name: 'Mouse', price: 45, quantity: 1 }],
      total: 45,
      expires_at: '2026-01-01T00:00:00.000Z',
    });
    productsService.findOne.mockReturnValue({ id: '1', name: 'Mouse', price: 45, stock: 10 });
    discountsService.findOne.mockResolvedValue({
      id: 'D1',
      description: '10% off orders over £100',
      type: 'PERCENTAGE',
      value: 0.1,
      minGuideline: 100,
    });
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    await expect(service.processCheckout('current-user', 'D1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
