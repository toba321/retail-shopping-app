import { create } from 'zustand';
import { CartItem, Cart } from '../types';
import { cartService } from '../services/api';

interface CartStore {
  items: Record<string, { quantity: number; name: string; price: number }>;
  total: number;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;
  timerId: number | null;

  // Store actions
  fetchCart: () => Promise<void>;
  setItemQuantity: (product: { id: string; name: string; price: number }, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearLocalCart: () => void;
  setError: (error: string | null) => void;
  getTimeRemaining: () => number | null;
  updateTimer: () => void;
  clearTimer: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: {},
  total: 0,
  expiresAt: null,
  isLoading: false,
  error: null,
  timerId: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartService.get();
      const itemsObject: Record<string, { quantity: number; name: string; price: number }> = {};
      cart.items.forEach(item => {
        itemsObject[item.productId] = {
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        };
      });
      set({
        items: itemsObject,
        total: cart.total,
        expiresAt: cart.expires_at,
        isLoading: false,
      });
      get().updateTimer();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch cart';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setItemQuantity: async (product, quantity) => {
    try {
      set({ isLoading: true, error: null });

      // Apply local update first for responsive UI.
      const currentItems = get().items;
      const newItems = { ...currentItems };
      if (quantity > 0) {
        newItems[product.id] = {
          quantity,
          name: product.name,
          price: product.price,
        };
      } else {
        delete newItems[product.id];
      }

      const newTotal = Object.values(newItems).reduce((acc, item) => acc + (item.price * item.quantity), 0);
      set({ items: newItems, total: newTotal, isLoading: false });

      // Persist the change to the backend.
      const result = await cartService.setItemQuantity(product.id, quantity);

      // Sync expiry from server response.
      set({
        expiresAt: result.expiresAt,
      });
      get().updateTimer();

    } catch (error) {
      // Reload cart snapshot when persistence fails.
      await get().fetchCart();
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update cart';
      set({ error: errorMessage, isLoading: false });
    }
  },

  removeItem: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Remove locally first for responsive UI.
      const currentItems = get().items;
      const newItems = { ...currentItems };
      delete newItems[productId];
      
      const newTotal = Object.values(newItems).reduce((acc, item) => acc + (item.price * item.quantity), 0);
      set({
        items: newItems,
        total: newTotal,
        // Hide reservation timer immediately when cart becomes empty.
        expiresAt: Object.keys(newItems).length === 0 ? null : get().expiresAt,
      });

      if (Object.keys(newItems).length === 0) {
        get().clearTimer();
      }

      // Persist removal to backend.
      const result = await cartService.setItemQuantity(productId, 0);

      set({ expiresAt: result.expiresAt });
      if (result.expiresAt) {
        get().updateTimer();
      } else {
        get().clearTimer();
      }

      set({ isLoading: false });
    } catch (error) {
      // Reload cart snapshot when persistence fails.
      await get().fetchCart();
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to remove item';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearLocalCart: () => {
    get().clearTimer();
    set({
      items: {},
      total: 0,
      expiresAt: null,
      error: null,
      isLoading: false,
    });
  },

  setError: (error) => {
    set({ error });
  },

  getTimeRemaining: () => {
    const { expiresAt } = get();
    if (!expiresAt) return null;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = expiry - now;

    return remaining > 0 ? remaining : 0;
  },

  updateTimer: () => {
    const { expiresAt, timerId } = get();

    // Replace existing timer whenever reservation expiry changes.
    if (timerId) {
      clearTimeout(timerId);
      set({ timerId: null });
    }

    if (!expiresAt) return;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = expiry - now;

    if (remaining > 0) {
      const newTimerId = setTimeout(() => {
        // Refresh cart when reservation window expires.
        get().fetchCart();
      }, remaining);

      set({ timerId: newTimerId });
    } else {
      // Reservation already expired, so refresh immediately.
      get().fetchCart();
    }
  },

  clearTimer: () => {
    const { timerId } = get();
    if (timerId) {
      clearTimeout(timerId);
      set({ timerId: null });
    }
  },
}));
