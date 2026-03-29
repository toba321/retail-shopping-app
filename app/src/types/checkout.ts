import { CartItem } from './cart';

// Checkout types
export interface CheckoutRequest {
  discountCode?: string;
}

export interface CheckoutResponse {
  orderId: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  discountApplied: number;
  appliedDiscountCode?: string | null;
  appliedDiscountDescription?: string | null;
  total: number;
  status: 'SUCCESS' | 'FAILED';
  message: string;
}