<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Worked example: products

Two use cases on one `Product` feature, end to end: UC-010 lists the available products (a read),
UC-011 creates a product (a write). Every relative import ends in `.js` because the layout
detection found NodeNext; drop the suffix where it did not.

## Backend — read path (UC-010)

```ts
// src/products/products.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDb } from '../database/drizzle.provider.js';
import { products } from '../database/schema.js';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  // UC-010 BR-010: Out-of-stock products are excluded regardless of any category filter.
  async findAvailable(category?: string) {
    const filters = [eq(products.inStock, true)];
    if (category) filters.push(eq(products.category, category));
    return this.db.select().from(products).where(and(...filters));
  }
}
```

```ts
// src/products/dto/product.response.ts
export type ProductResponse = {
  id: number;
  name: string;
  category: string;
  price: number;
};
```

```ts
// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository.js';
import type { ProductResponse } from './dto/product.response.js';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async listAvailable(category?: string): Promise<ProductResponse[]> {
    const rows = await this.repository.findAvailable(category);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
    }));
  }
}
```

```ts
// src/products/dto/list-products.query.ts
import { IsOptional, IsString } from 'class-validator';

export class ListProductsQuery {
  @IsOptional()
  @IsString()
  category?: string;
}
```

```ts
// src/products/products.controller.ts
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
```

```ts
// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsRepository } from './products.repository.js';
import { ProductsService } from './products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
```

Register the module in the application's root module.

## Backend — write path (UC-011)

A body DTO, a domain error, and a repository insert. The DTO's decorators carry the rules the
global `ValidationPipe` enforces; the rule that needs the database lives in the service.

```ts
// src/products/dto/create-product.body.ts
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  category!: string;

  // UC-011 BR-001: The price is a whole number of cents and never negative.
  @IsInt()
  @Min(0)
  price!: number;
}
```

```ts
// src/products/products.repository.ts — added to the class above
  async findByName(name: string) {
    return (await this.db.select().from(products).where(eq(products.name, name)).limit(1))[0];
  }

  async insert(values: typeof products.$inferInsert) {
    const [row] = await this.db.insert(products).values(values).returning();
    return row;
  }
```

```ts
// src/products/products.service.ts — added to the class above
import { DuplicateNameError } from '../common/errors.js'; // the project's domain error
import type { CreateProductBody } from './dto/create-product.body.js';

  async create(body: CreateProductBody): Promise<ProductResponse> {
    // UC-011 BR-002: Product names are unique.
    if (await this.repository.findByName(body.name)) {
      throw new DuplicateNameError('A product with this name already exists.');
    }
    const row = await this.repository.insert({ ...body, inStock: true });
    return { id: row.id, name: row.name, category: row.category, price: row.price };
  }
```

```ts
// src/products/products.controller.ts — added to the class above
import { Body, HttpCode, Post } from '@nestjs/common';
import { CreateProductBody } from './dto/create-product.body.js';

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateProductBody): Promise<ProductResponse> {
    return this.service.create(body);
  }
```

The message is the one the use case's alternative flow states. The project's exception filter maps
`DuplicateNameError` to its status code (typically 409) and error body; when the project has no
domain errors yet, throw Nest's `ConflictException` with the same message instead of inventing a
hierarchy.

## Frontend

Where the detection found **no route indirection**, the route file holds the page:

```tsx
// src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Product = { id: number; name: string; category: string; price: number };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    fetch(`/api/products${query}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [category]);

  return (
    <main>
      <h1>Products</h1>
      <label htmlFor="category">Category</label>
      <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="tools">Tools</option>
      </select>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

Where the detection found **route indirection**, the route file is a thin wrapper and the body
above lives in the view component instead:

```tsx
// src/app/products/page.tsx
'use client';
import { ProductsPage } from '../../views/ProductsPage';

export default function Page() {
  return <ProductsPage />;
}
```

