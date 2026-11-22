import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import type { CategoryResponse } from './dto/category.response.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  async listAll(): Promise<CategoryResponse[]> {
    const rows = await this.repository.findAll();
    return rows.map((row) => ({ id: row.id, name: row.name }));
  }
}
