import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDb } from '../database/drizzle.provider.js';
import { products } from '../database/schema.js';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  // BR-010: out-of-stock products are excluded regardless of any category filter.
  async findAvailable(category?: string) {
    const filters = [eq(products.inStock, true)];
    if (category) filters.push(eq(products.category, category));
    return this.db.select().from(products).where(and(...filters));
  }
}
