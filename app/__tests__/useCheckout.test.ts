import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useCheckout } from '../src/hooks/useCheckout';
import { useCartStore } from '../src/store/useCart';
import { checkoutService, discountsService } from '../src/services/api';
import { Discount } from '../src/types';

jest.mock('../src/store/useCart', () => ({
  useCartStore: jest.fn(),
}));

jest.mock('../src/services/api', () => ({
  checkoutService: {
    execute: jest.fn(),
  },
  discountsService: {
    getAll: jest.fn(),
  },
}));

const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockCheckoutService = checkoutService as jest.Mocked<typeof checkoutService>;
const mockDiscountsService = discountsService as jest.Mocked<typeof discountsService>;

describe('useCheckout', () => {
  const discounts: Discount[] = [
    {
      id: 'D1',
      description: '10% off orders over £100',
      type: 'PERCENTAGE',
      value: 0.1,
      minGuideline: 100,
    },
    {
      id: 'D2',
      description: '£5 off your purchase',
      type: 'FIXED',
      value: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCartStore.mockReturnValue({
      items: {
        '1': { quantity: 1, name: 'Headphones', price: 120 },
      },
      total: 120,
      clearLocalCart: jest.fn(),
    } as ReturnType<typeof useCartStore>);

    mockDiscountsService.getAll.mockResolvedValue(discounts);
    mockCheckoutService.execute.mockResolvedValue({
      status: 'SUCCESS',
      orderId: 'ORD-1',
      user: 'current-user',
      items: [],
      subtotal: 120,
      discountApplied: 12,
      appliedDiscountCode: 'D1',
      appliedDiscountDescription: '10% off orders over £100',
      total: 108,
      message: 'ok',
    });
  });

  it('auto-selects the best eligible discount', async () => {
    const { result } = renderHook(() => useCheckout());

    await waitFor(() => {
      expect(result.current.discountCode).toBe('D1');
    });
  });

  it('blocks checkout when user enters a discount that does not meet minimum spend', async () => {
    mockUseCartStore.mockReturnValue({
      items: {
        '1': { quantity: 1, name: 'Mouse', price: 45 },
      },
      total: 45,
      clearLocalCart: jest.fn(),
    } as ReturnType<typeof useCartStore>);

    const { result } = renderHook(() => useCheckout());

    await waitFor(() => {
      expect(result.current.discountCode).toBe('D2');
    });

    act(() => {
      result.current.handleDiscountCodeChange('D1');
    });

    await waitFor(() => {
      expect(result.current.discountCodeError).toBe('Minimum spend of £100.00 required for this code');
    });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(result.current.error).toBe('Minimum spend of £100.00 required for this code');
    expect(mockCheckoutService.execute).not.toHaveBeenCalled();
  });
});
