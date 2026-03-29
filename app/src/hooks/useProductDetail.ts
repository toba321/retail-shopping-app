import { useEffect, useState } from 'react';
import { Product } from '../types';
import { productsService } from '../services/api';
import { useCartStore } from '../store/useCart';

interface UseProductDetailReturn {
  product: Product | null;
  quantity: string;
  isLoading: boolean;
  error: string | null;
  isUpdatingCart: boolean;
  cartItem: { quantity: number; name: string; price: number; } | undefined;
  setError: (error: string | null) => void;
  setQuantity: (quantity: string) => void;
  handleAddToCart: () => Promise<void>;
}

export const useProductDetail = (productId: string): UseProductDetailReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const { setItemQuantity, items } = useCartStore();

  const cartItem: { quantity: number; name: string; price: number; } | undefined = items[productId];

  // Load product details for the selected product screen.
  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsService.getById(productId);
      setProduct(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load product';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate quantity and persist cart quantity for this product.
  const handleAddToCart = async () => {
    if (!product) return;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setError('Please enter a valid quantity');
      return;
    }

    try {
      setIsUpdatingCart(true);
      setError(null);
      await setItemQuantity(product, qty);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update cart';
      setError(errorMessage);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  // Load once when product id changes.
  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // Keep quantity input aligned with cart state without re-fetching product data.
  useEffect(() => {
    const currentCartItem = items[productId];
    if (currentCartItem) {
      setQuantity(currentCartItem.quantity.toString());
    }
  }, [items, productId]);

  return {
    product,
    quantity,
    isLoading,
    error,
    isUpdatingCart,
    cartItem,

    setError,
    setQuantity,
    handleAddToCart,
  };
};