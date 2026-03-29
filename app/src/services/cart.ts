import { AxiosInstance } from 'axios';
import { Cart } from '../types';

export const createCartService = (apiClient: AxiosInstance) => ({
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>(`/cart`);
    return response.data;
  },

  setItemQuantity: async (
    productId: string,
    quantity: number
  ): Promise<{ expiresAt: string | null; itemCount: number }> => {
    if (quantity > 0) {
      // Positive quantity sets or updates a cart line.
      console.log(`Setting quantity for product ${productId} to ${quantity}`);
      const response = await apiClient.post<Cart>('/cart/items', {
        productId,
        quantity,
      });
      return {
        expiresAt: response.data.expires_at,
        itemCount: response.data.items.length,
      };
    } else {
      // Zero quantity removes the cart line.
      const response = await apiClient.delete<Cart>(
        `/cart/items/${productId}`
      );
      return {
        expiresAt: response.data.expires_at,
        itemCount: response.data.items.length,
      };
    }
  },

  removeItem: async (
    productId: string
  ): Promise<{ expiresAt: string | null; itemCount: number }> => {
    const response = await apiClient.delete<Cart>(
      `/cart/items/${productId}`
    );
    return {
      expiresAt: response.data.expires_at,
      itemCount: response.data.items.length,
    };
  },
});