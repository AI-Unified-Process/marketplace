import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
