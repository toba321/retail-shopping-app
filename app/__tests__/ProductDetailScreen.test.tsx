import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductDetailScreen } from '../src/screens/ProductDetailScreen';
import {
  ProductDetailScreenNavigationProp,
  ProductDetailScreenRouteProp,
} from '../src/types';

jest.mock('../src/hooks/useProductDetail', () => ({
  useProductDetail: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

// Provide stable navigation spies for component interaction assertions.
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

import { useProductDetail } from '../src/hooks/useProductDetail';

const mockUseProductDetail = useProductDetail as jest.MockedFunction<typeof useProductDetail>;

const createRoute = (productId: string): ProductDetailScreenRouteProp => ({
  key: 'ProductDetail-test-key',
  name: 'ProductDetail',
  params: { productId },
});

const createNavigation = (): ProductDetailScreenNavigationProp => ({
  navigate: mockNavigate,
  goBack: mockGoBack,
} as unknown as ProductDetailScreenNavigationProp);

describe('ProductDetailScreen', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    stock: 5,
  };

  const mockCartItem = {
    productId: '1',
    name: 'Test Product',
    price: 10.99,
    quantity: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default hook state for baseline render assertions.
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      quantity: '2',
      isLoading: false,
      error: null,
      isUpdatingCart: false,
      cartItem: mockCartItem,
      setError: jest.fn(),
      setQuantity: jest.fn(),
      handleAddToCart: jest.fn(),
    });
  });

  it('displays product information correctly', async () => {
    const route = createRoute('1');
    const navigation = createNavigation();

    const { getByText, getByDisplayValue } = render(
      <ProductDetailScreen route={route} navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByText('Test Product')).toBeTruthy();
      expect(getByText('£10.99')).toBeTruthy();
      expect(getByText('In stock:')).toBeTruthy();
      expect(getByText('In your cart:')).toBeTruthy();
      expect(getByDisplayValue('2')).toBeTruthy();
    });
  });

  it('updates quantity when cart changes', async () => {
    const route = createRoute('1');
    const navigation = createNavigation();

    const { rerender, getByDisplayValue } = render(
      <ProductDetailScreen route={route} navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByDisplayValue('2')).toBeTruthy();
    });

    const updatedCartItem = { ...mockCartItem, quantity: 3 };
    mockUseProductDetail.mockReturnValue({
      product: mockProduct,
      quantity: '3',
      isLoading: false,
      error: null,
      isUpdatingCart: false,
      cartItem: updatedCartItem,
      setError: jest.fn(),
      setQuantity: jest.fn(),
      handleAddToCart: jest.fn(),
    });

    rerender(
      <ProductDetailScreen route={route} navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByDisplayValue('3')).toBeTruthy();
    });

    expect(getByDisplayValue('3')).toBeTruthy();
  });

  it('allows clearing quantity input to type new number', async () => {
    const route = createRoute('1');
    const navigation = createNavigation();

    const mockSetQuantity = jest.fn();
    mockUseProductDetail.mockReturnValueOnce({
      product: mockProduct,
      quantity: '2',
      isLoading: false,
      error: null,
      isUpdatingCart: false,
      cartItem: mockCartItem,
      setError: jest.fn(),
      setQuantity: mockSetQuantity,
      handleAddToCart: jest.fn(),
    });

    const { getByDisplayValue } = render(
      <ProductDetailScreen route={route} navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByDisplayValue('2')).toBeTruthy();
    });

    const input = getByDisplayValue('2');
    fireEvent.changeText(input, '');

    expect(mockSetQuantity).toHaveBeenCalledWith('');
  });

  it('disables add to cart button when quantity is 0 or empty', async () => {
    const route = createRoute('1');
    const navigation = createNavigation();

    mockUseProductDetail.mockReturnValueOnce({
      product: mockProduct,
      quantity: '',
      isLoading: false,
      error: null,
      isUpdatingCart: false,
      cartItem: undefined,
      setError: jest.fn(),
      setQuantity: jest.fn(),
      handleAddToCart: jest.fn(),
    });

    const { getByText } = render(
      <ProductDetailScreen route={route} navigation={navigation} />
    );

    const addButton = getByText('Add to Cart');
    expect(addButton).toBeDisabled();
  });
});