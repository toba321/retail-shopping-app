import { Injectable } from '@nestjs/common';

export interface Discount {
  id: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BOGOF';
  value?: number; // Percentage discounts can be expressed as 0.1 (10%) or 10.
  minGuideline?: number; // Minimum subtotal required before a discount can apply.
}

@Injectable()
export class DiscountsService {
  private discounts: Discount[] = [
    { id: 'D1', description: '10% off orders over £100', type: 'PERCENTAGE', value: 0.1, minGuideline: 100 },
    { id: 'D2', description: '£5 off your purchase', type: 'FIXED', value: 5 },
  ];

  async findAll(): Promise<Discount[]> {
    return this.discounts;
  }

  async findOne(id: string): Promise<Discount | undefined> {
    return this.discounts.find(discount => discount.id === id);
  }

  calculateDiscount(subtotal: number): number {
    let totalDiscount = 0;
    // Keep the single highest qualifying discount value for this subtotal.
    for (const d of this.discounts) {
      if (d.type === 'PERCENTAGE' && subtotal >= (d.minGuideline || 0)) {
        totalDiscount = Math.max(totalDiscount, subtotal * (d.value || 0));
      } else if (d.type === 'FIXED' && subtotal > (d.value || 0)) {
        totalDiscount = Math.max(totalDiscount, d.value || 0);
      }
    }
    return totalDiscount;
  }
}