import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns seeded catalogue with at least 5 products', () => {
    const products = service.findAll();
    expect(products.length).toBeGreaterThanOrEqual(5);
  });

  it('finds product by id', () => {
    const product = service.findOne('1');
    expect(product.id).toBe('1');
  });

  it('throws not found for unknown product id', () => {
    expect(() => service.findOne('missing')).toThrow(NotFoundException);
  });

  it('updates stock by delta quantity', () => {
    const before = service.findOne('1').stock;

    service.updateStock('1', -2);
    expect(service.findOne('1').stock).toBe(before - 2);

    service.updateStock('1', 2);
    expect(service.findOne('1').stock).toBe(before);
  });
});
