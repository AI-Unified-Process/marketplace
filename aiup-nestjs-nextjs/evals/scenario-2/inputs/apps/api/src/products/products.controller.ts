import { Controller, Get, Query } from '@nestjs/common';
import { ListProductsQuery } from './dto/list-products.query.js';
import { ProductsService } from './products.service.js';
import type { ProductResponse } from './dto/product.response.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  async list(@Query() query: ListProductsQuery): Promise<ProductResponse[]> {
    return this.service.listAvailable(query.category);
  }
}
