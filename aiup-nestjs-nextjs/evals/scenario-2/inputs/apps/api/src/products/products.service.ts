import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository.js';
import type { ProductResponse } from './dto/product.response.js';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async listAvailable(category?: string): Promise<ProductResponse[]> {
    const rows = await this.repository.findAvailable(category);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
    }));
  }
}
