import axios, { AxiosInstance } from 'axios';
import { APP_CONFIG } from '../config';
import { createProductsService } from './products';
import { createDiscountsService } from './discounts';
import { createCartService } from './cart';
import { createCheckoutService } from './checkout';

// Configuration
const API_BASE_URL = APP_CONFIG.apiBaseUrl;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor to handle errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract user-friendly error message from response
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error occurred. Please check your connection and try again.');
  }
);

// Create service instances
export const productsService = createProductsService(apiClient);
export const discountsService = createDiscountsService(apiClient);
export const cartService = createCartService(apiClient);
export const checkoutService = createCheckoutService(apiClient);

export default apiClient;
