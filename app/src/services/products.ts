import { AxiosInstance } from 'axios';
import { Product, Discount } from '../types';

export const createProductsService = (apiClient: AxiosInstance) => ({
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getDiscounts: async (): Promise<Discount[]> => {
    const response = await apiClient.get<Discount[]>('/products/discounts');
    return response.data;
  },
});