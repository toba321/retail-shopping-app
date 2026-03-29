import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class ProductsService {
  // In-memory catalogue used as the starting inventory state.
  private products: Product[] = [
    { id: '1', name: 'Premium Wireless Headphones', price: 199.99, stock: 10 },
    { id: '2', name: 'Mechanical Keyboard', price: 125.00, stock: 5 },
    { id: '3', name: 'Ergonomic Mouse', price: 45.00, stock: 20 },
    { id: '4', name: '4K Monitor', price: 350.00, stock: 3 },
    { id: '5', name: 'USB-C Docking Station', price: 89.99, stock: 0 },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  updateStock(id: string, quantity: number): void {
    const product = this.findOne(id);
    // Negative quantity consumes stock; positive quantity restores stock.
    product.stock += quantity;
  }
}