import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsRepository } from './products.repository.js';
import { ProductsService } from './products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
