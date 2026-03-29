import { AxiosInstance } from 'axios';
import { CheckoutRequest, CheckoutResponse } from '../types';

export const createCheckoutService = (apiClient: AxiosInstance) => ({
  execute: async (request: CheckoutRequest = {}): Promise<CheckoutResponse> => {
    const response = await apiClient.post<CheckoutResponse>(
      '/checkout',
      request,
      {
        headers: {
          Authorization: 'Bearer dummy-token',
        },
      }
    );
    return response.data;
  },
});