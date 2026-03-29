// Discount types
export interface Discount {
  id: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BOGOF';
  value?: number;
  minGuideline?: number;
}