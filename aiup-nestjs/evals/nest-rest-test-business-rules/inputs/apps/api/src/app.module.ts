import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [DatabaseModule, ProductsModule],
})
export class AppModule {}
