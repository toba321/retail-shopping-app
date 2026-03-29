import { useCartStore } from '../src/store/useCart';
import { cartService } from '../src/services/api';

// Mock API layer so store behavior is asserted independently from network calls.
jest.mock('../src/services/api', () => ({
  cartService: {
    get: jest.fn(),
    setItemQuantity: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('useCartStore', () => {
  beforeEach(() => {
    // Start each test from a clean store snapshot.
    useCartStore.setState({
      items: {},
      total: 0,
      expiresAt: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual({});
    expect(state.total).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('setItemQuantity', () => {
    it('should add item successfully', async () => {
      const mockCart = {
        expiresAt: new Date(Date.now() + 120000).toISOString(),
        itemCount: 1,
      };
      (cartService.setItemQuantity as jest.Mock).mockResolvedValue(mockCart);

      const { setItemQuantity } = useCartStore.getState();
      await setItemQuantity({ id: '1', name: 'Test Product', price: 10 }, 2);

      const state = useCartStore.getState();
      expect(state.items).toEqual({
        '1': { quantity: 2, name: 'Test Product', price: 10 }
      });
      expect(state.total).toBe(20);
      expect(state.expiresAt).toBe(mockCart.expiresAt);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle add item error', async () => {
      (cartService.setItemQuantity as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { setItemQuantity } = useCartStore.getState();
      await setItemQuantity({ id: '1', name: 'Test Product', price: 10 }, 2);

      const state = useCartStore.getState();
      expect(state.error).toBe('API Error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity successfully', async () => {
      const mockCart = {
        expiresAt: new Date(Date.now() + 120000).toISOString(),
        itemCount: 1,
      };
      (cartService.setItemQuantity as jest.Mock).mockResolvedValue(mockCart);

      const { setItemQuantity } = useCartStore.getState();
      await setItemQuantity({ id: '1', name: 'Test Product', price: 10 }, 5);

      const state = useCartStore.getState();
      expect(state.items).toEqual({
        '1': { quantity: 5, name: 'Test Product', price: 10 }
      });
      expect(state.total).toBe(50);
      expect(state.expiresAt).toBe(mockCart.expiresAt);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle update quantity error', async () => {
      (cartService.setItemQuantity as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const { setItemQuantity } = useCartStore.getState();
      await setItemQuantity({ id: '1', name: 'Test Product', price: 10 }, 5);

      const state = useCartStore.getState();
      expect(state.error).toBe('Update failed');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('should remove item successfully', async () => {
      const mockCart = {
        expiresAt: null,
        itemCount: 0,
      };
      (cartService.setItemQuantity as jest.Mock).mockResolvedValue(mockCart);

      useCartStore.setState({
        items: {
          '1': { quantity: 1, name: 'Test Product', price: 10 },
        },
        total: 10,
        expiresAt: new Date(Date.now() + 120000).toISOString(),
      });

      const { removeItem } = useCartStore.getState();
      await removeItem('1');

      const state = useCartStore.getState();
      expect(state.items).toEqual({});
      expect(state.total).toBe(0);
      expect(state.expiresAt).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchCart', () => {
    it('should fetch cart successfully', async () => {
      const mockCart = {
        items: [{ productId: '1', name: 'Test Product', price: 10, quantity: 1 }],
        total: 10,
        expires_at: new Date(Date.now() + 120000).toISOString(),
      };
      (cartService.get as jest.Mock).mockResolvedValue(mockCart);

      const { fetchCart } = useCartStore.getState();
      await fetchCart();

      const state = useCartStore.getState();
      expect(state.items).toEqual({
        '1': { quantity: 1, name: 'Test Product', price: 10 }
      });
      expect(state.total).toBe(10);
      expect(state.expiresAt).toBe(mockCart.expires_at);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
