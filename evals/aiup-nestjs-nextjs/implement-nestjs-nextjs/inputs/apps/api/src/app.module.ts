import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';

@Module({
  imports: [CategoriesModule],
})
export class AppModule {}
