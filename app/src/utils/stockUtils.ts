import { Product } from '../types';

/**
 * Calculates the available stock for a product by subtracting cart quantities
 * @param product The product with server stock level
 * @param cartItems Object of cart items keyed by productId
 * @returns The available stock (server stock minus cart quantities)
 */
export const calculateAvailableStock = (product: Product, cartItems: Record<string, { quantity: number; name: string; price: number }>): number => {
  const cartQuantity = cartItems[product.id]?.quantity || 0;
  return Math.max(0, product.stock - cartQuantity);
};

/**
 * Checks if a product is available for purchase (has stock after accounting for cart)
 * @param product The product to check
 * @param cartItems Object of cart items
 * @returns True if the product has available stock
 */
export const isProductAvailable = (product: Product, cartItems: Record<string, { quantity: number; name: string; price: number }>): boolean => {
  return calculateAvailableStock(product, cartItems) > 0;
};

/**
 * Gets the total quantity of a product in the cart
 * @param productId The product ID to check
 * @param cartItems Object of cart items
 * @returns The quantity in cart (0 if not in cart)
 */
export const getCartQuantity = (productId: string, cartItems: Record<string, { quantity: number; name: string; price: number }>): number => {
  return cartItems[productId]?.quantity || 0;
};