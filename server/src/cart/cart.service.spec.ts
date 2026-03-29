import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';

describe('CartService', () => {
  let service: CartService;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const mockProductsService = {
      findOne: jest.fn(),
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    productsService = module.get(ProductsService);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return empty cart for non-existent user', () => {
      const result = service.getCart('non-existent');
      expect(result).toEqual({
        items: [],
        total: 0,
        expires_at: null,
      });
    });

    it('should return cart with items and total', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await service.addToCart('user1', '1', 2);

      const result = service.getCart('user1');
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        productId: '1',
        name: 'Test Product',
        price: 10,
        quantity: 2,
      });
      expect(result.total).toBe(20);
      expect(result.expires_at).toBeTruthy();
    });
  });

  describe('addToCart', () => {
    it('should add item to cart without touching stock', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      const result = await service.addToCart('user1', '1', 2);

      expect(productsService.findOne).toHaveBeenCalledWith('1');
      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.expiresAt).toBeDefined();
      expect(result.itemCount).toBe(1);
    });

    it('should allow adding more than available stock', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 2,
      });

      // Cart accepts quantity; stock enforcement is verified during checkout.
      const result = await service.addToCart('user1', '1', 99);

      expect(result.itemCount).toBe(1);
      expect(productsService.updateStock).not.toHaveBeenCalled();
    });

    it('should replace quantity when adding same product twice', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await service.addToCart('user1', '1', 2);
      const result = await service.addToCart('user1', '1', 7);

      const cart = service.getCart('user1');
      expect(cart.items[0].quantity).toBe(7);
      expect(result.itemCount).toBe(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item without touching stock', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await service.addToCart('user1', '1', 2);
      const result = await service.updateQuantity('user1', '1', 4);

      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.itemCount).toBe(1);
    });

    it('should throw error for item not in cart', async () => {
      await expect(service.updateQuantity('user1', 'nonexistent', 2)).rejects.toThrow();
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart without touching stock', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await service.addToCart('user1', '1', 2);
      const result = await service.removeFromCart('user1', '1');

      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.itemCount).toBe(0);
    });
  });
});
