import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '../store/useCart';
import { CheckoutResponse, Discount } from '../types';
import { checkoutService, discountsService } from '../services/api';

const getDiscountValue = (subtotal: number, discount: Discount): number => {
  if (discount.type === 'PERCENTAGE') {
    const raw = discount.value || 0;
    const rate = raw > 1 ? raw / 100 : raw;
    return Math.round(subtotal * rate * 100) / 100;
  }

  if (discount.type === 'FIXED') {
    return Math.min(discount.value || 0, subtotal);
  }

  return 0;
};

export const useCheckout = () => {
  const { items, total, clearLocalCart } = useCartStore();
  const [checkoutResponse, setCheckoutResponse] = useState<CheckoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountCodeError, setDiscountCodeError] = useState<string | null>(null);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [isManualDiscount, setIsManualDiscount] = useState(false);

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const discounts = await discountsService.getAll();
        setAvailableDiscounts(discounts);
      } catch {
        setAvailableDiscounts([]);
      }
    };

    loadDiscounts();
  }, []);

  const detectedDiscount = useMemo(() => {
    const eligible = availableDiscounts.filter((discount) => !discount.minGuideline || total >= discount.minGuideline);
    if (eligible.length === 0) return null;

    return eligible.reduce((best, current) => {
      const bestValue = getDiscountValue(total, best);
      const currentValue = getDiscountValue(total, current);
      return currentValue > bestValue ? current : best;
    });
  }, [availableDiscounts, total]);

  useEffect(() => {
    if (!isManualDiscount) {
      setDiscountCode(detectedDiscount?.id || '');
    }
  }, [detectedDiscount, isManualDiscount]);

  const handleDiscountCodeChange = (code: string) => {
    const normalized = code.trim().toUpperCase();
    setDiscountCode(normalized);
    setIsManualDiscount(normalized.length > 0);

    if (normalized.length > 0 && availableDiscounts.length > 0) {
      const found = availableDiscounts.find((d) => d.id.toUpperCase() === normalized);
      if (!found) {
        setDiscountCodeError('Invalid discount code');
      } else if (found.minGuideline && total < found.minGuideline) {
        setDiscountCodeError(`Minimum spend of £${found.minGuideline.toFixed(2)} required for this code`);
      } else {
        setDiscountCodeError(null);
      }
    } else {
      setDiscountCodeError(null);
    }
  };

  const selectedDiscount = useMemo(() => {
    if (!discountCode) return null;
    return availableDiscounts.find((discount) => discount.id.toUpperCase() === discountCode.toUpperCase()) || null;
  }, [availableDiscounts, discountCode]);

  const selectedDiscountDescription = selectedDiscount?.description || null;

  const handleCheckout = async () => {
    if (Object.keys(items).length === 0) {
      setError('Cart is empty. Please add items before checkout.');
      return;
    }

    if (discountCodeError) {
      setError(discountCodeError);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await checkoutService.execute({ discountCode: discountCode || undefined });

      if (response.status === 'FAILED') {
        setError(response.message || 'Checkout failed');
      } else {
        setCheckoutResponse(response);
        clearLocalCart();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Checkout failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCheckout = () => {
    setCheckoutResponse(null);
  };

  return {
    checkoutResponse,
    isLoading,
    error,
    discountCode,
    discountCodeError,
    selectedDiscountDescription,
    handleDiscountCodeChange,

    handleCheckout,
    resetCheckout,
    setError,
  };
};