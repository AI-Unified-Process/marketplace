import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import type { CategoryResponse } from './dto/category.response.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  async list(): Promise<CategoryResponse[]> {
    return this.service.listAll();
  }
}
