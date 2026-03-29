import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';

describe('CartController (Integration)', () => {
  let controller: CartController;
  let cartService: CartService;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const mockProductsService = {
      findOne: jest.fn(),
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
    productsService = module.get(ProductsService);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItem', () => {
    it('should add item to cart and return updated cart', async () => {
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      const result = await controller.addItem({ productId: '1', quantity: 2 });

      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        productId: '1',
        name: 'Test Product',
        price: 10,
        quantity: 2,
      });
      expect(result.total).toBe(20);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity in cart', async () => {
      // Seed cart with a single line item before updating quantity.
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await controller.addItem({ productId: '1', quantity: 2 });

      const result = await controller.updateQuantity('1', { quantity: 4 });

      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(4);
      expect(result.total).toBe(40);
    });

    it('should remove item when quantity set to 0', async () => {
      // Seed cart with a single line item before removing via quantity=0.
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await controller.addItem({ productId: '1', quantity: 2 });

      const result = await controller.updateQuantity('1', { quantity: 0 });

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      // Seed cart with a single line item before explicit remove call.
      productsService.findOne.mockReturnValue({
        id: '1',
        name: 'Test Product',
        price: 10,
        stock: 5,
      });

      await controller.addItem({ productId: '1', quantity: 2 });

      const result = await controller.removeItem('1');

      expect(productsService.updateStock).not.toHaveBeenCalled();
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
