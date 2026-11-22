import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDb } from '../database/drizzle.provider.js';
import { products } from '../database/schema.js';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async findById(id: number) {
    return (await this.db.select().from(products).where(eq(products.id, id)).limit(1))[0];
  }
}
