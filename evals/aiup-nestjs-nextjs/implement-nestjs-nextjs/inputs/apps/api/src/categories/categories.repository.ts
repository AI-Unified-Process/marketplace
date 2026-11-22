import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDb } from '../database/drizzle.provider.js';
import { category } from '../database/schema.js';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async findAll() {
    return this.db.select().from(category);
  }
}
