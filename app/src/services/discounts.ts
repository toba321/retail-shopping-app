import { AxiosInstance } from 'axios';
import { Discount } from '../types';

export const createDiscountsService = (apiClient: AxiosInstance) => ({
  getAll: async (): Promise<Discount[]> => {
    const response = await apiClient.get<Discount[]>('/discounts');
    return response.data;
  },

  getById: async (id: string): Promise<Discount> => {
    const response = await apiClient.get<Discount>(`/discounts/${id}`);
    return response.data;
  },
});