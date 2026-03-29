import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  // Each user has cart items plus an expiry timer for the active reservation window.
  private carts = new Map<string, { 
    items: Record<string, number>, 
    timer: NodeJS.Timeout, 
    expiresAt: string 
  }>();

  constructor(private productsService: ProductsService) {}

  getCart(userId: string) {
    const cart = this.carts.get(userId);
    
    // Empty carts return no expiry so the client can hide reservation countdown UI.
    if (!cart || Object.keys(cart.items).length === 0) {
      return { 
        items: [], 
        total: 0, 
        expires_at: null
      };
    }

    // Expand stored quantities into full cart lines using current product data.
    const itemList = Object.entries(cart.items).map(([id, qty]) => {
      const p = this.productsService.findOne(id);
      return { productId: id, name: p.name, price: p.price, quantity: qty };
    });

    const total = itemList.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    return {
      items: itemList,
      total: total,
      expires_at: cart.expiresAt
    };
  }

  async addToCart(userId: string, productId: string, qty: number) {
    // Product lookup ensures item exists before storing quantity.
    this.productsService.findOne(productId);

    let cart = this.carts.get(userId);
    if (!cart) {
      cart = { items: {}, timer: null, expiresAt: '' };
      this.carts.set(userId, cart);
    }

    // Quantity is replaced for this product key.
    cart.items[productId] = qty;

    this.resetTimer(userId);
    return { expiresAt: cart.expiresAt, itemCount: Object.keys(cart.items).length };
  }

  async updateQuantity(userId: string, productId: string, newQty: number) {
    const cart = this.carts.get(userId);
    if (!cart || !cart.items[productId]) throw new NotFoundException('Item not in cart');

    if (newQty <= 0) return this.removeFromCart(userId, productId);

    // Product lookup ensures item still exists.
    this.productsService.findOne(productId);

    cart.items[productId] = newQty;

    this.resetTimer(userId);
    return { expiresAt: cart.expiresAt, itemCount: Object.keys(cart.items).length };
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = this.carts.get(userId);
    if (cart && cart.items[productId]) {
      delete cart.items[productId];
      
      if (Object.keys(cart.items).length === 0) {
        this.clearCartInternal(userId);
      } else {
        this.resetTimer(userId);
      }
    }
    return { expiresAt: cart?.expiresAt || null, itemCount: cart ? Object.keys(cart.items).length : 0 };
  }

  private resetTimer(userId: string) {
    const cart = this.carts.get(userId);
    if (cart?.timer) clearTimeout(cart.timer);

    cart.expiresAt = new Date(Date.now() + 120000).toISOString();
    cart.timer = setTimeout(() => this.clearCartInternal(userId), 120000);
  }

  clearCartInternal(userId: string) {
    const cart = this.carts.get(userId);
    if (!cart) return;

    if (cart.timer) clearTimeout(cart.timer);
    this.carts.delete(userId);
  }

  clearCart(userId: string) {
    const cart = this.carts.get(userId);
    if (!cart) return;

    if (cart.timer) clearTimeout(cart.timer);
    this.carts.delete(userId);
  }
}