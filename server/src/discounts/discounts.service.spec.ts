import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';

describe('DiscountsService', () => {
  let service: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountsService],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns seeded active discounts', async () => {
    const discounts = await service.findAll();

    expect(discounts.length).toBeGreaterThanOrEqual(2);
    expect(discounts.some((d) => d.id === 'D1')).toBe(true);
    expect(discounts.some((d) => d.id === 'D2')).toBe(true);
  });

  it('finds discount by id and returns undefined for missing id', async () => {
    const existing = await service.findOne('D1');
    const missing = await service.findOne('UNKNOWN');

    expect(existing?.id).toBe('D1');
    expect(missing).toBeUndefined();
  });

  it('applies highest qualifying discount value', () => {
    // For subtotal 120, percentage discount should beat fixed discount.
    const discount = service.calculateDiscount(120);
    expect(discount).toBe(12);
  });
});
