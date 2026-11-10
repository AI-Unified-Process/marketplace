<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Worked example: the products service

Two use cases on one `Product` feature: UC-010 lists the available products (a read), UC-011 creates a product (a
write). Every relative import ends in `.js` because the layout detection found NodeNext; drop the suffix where it did
not. The repository comes from the persistence Handover; the controller is in the worked example of `/nest-rest`.

## The service

```ts
// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { isConstraintViolation } from '../common/errors.js';
import { DuplicateNameError, NegativePriceError } from './products.errors.js';
import { ProductsRepository, type Product } from './products.repository.js';

export type CreateProduct = {
  name: string;
  category: string;
  price: number;
};

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  /** UC-010 steps 1–2, A1: lists the products available to buy. */
  async listAvailable(category?: string): Promise<Product[]> {
    return this.repository.findAvailable(category);
  }

  /** UC-011 steps 3–4, A1: creates a product. */
  async create(input: CreateProduct): Promise<Product> {
    // UC-011 BR-001: The price is a whole number of cents and never negative.
    if (!Number.isInteger(input.price) || input.price < 0) {
      throw new NegativePriceError();
    }
    // UC-011 BR-002: Product names are unique.
    if (await this.repository.findByName(input.name)) {
      throw new DuplicateNameError();
    }
    try {
      return await this.repository.insert({ ...input, inStock: true });
    } catch (err) {
      // UC-011 BR-002: Product names are unique.
      if (isConstraintViolation(err, '23505', 'idx_product_name')) {
        throw new DuplicateNameError();
      }
      throw err;
    }
  }
}
```

The name check gives the rule its message; the catch keeps it when two requests pass the check together, because the
persistence Handover says `insert` raises `23505` on `idx_product_name`. The constraint name keeps a violation of
another unique key from getting this rule's message.

`listAvailable` carries no marker: UC-010 BR-010 ("out-of-stock products are never shown") only shapes the read, so its
marker sits on the query condition in the repository.

## The domain errors

```ts
// src/products/products.errors.ts
import { BusinessRuleError } from '../common/errors.js';

export class DuplicateNameError extends BusinessRuleError {
  constructor() {
    super('A product with this name already exists.');
  }
}

export class NegativePriceError extends BusinessRuleError {
  constructor() {
    super('The price must be a whole number of cents and must not be negative.');
  }
}
```

The message is the one the use case's alternative flow states. Without a hierarchy, the base classes are created once:

```ts
// src/common/errors.ts
export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export function isConstraintViolation(err: unknown, code: '23505' | '23514', constraint?: string): boolean {
  type PgError = { code?: string; constraint?: string };
  const { cause, ...own } = err as PgError & { cause?: PgError };
  return [own, cause].some((e) => e?.code === code && (constraint === undefined || e.constraint === constraint));
}
```

## The module

```ts
// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsRepository } from './products.repository.js';
import { ProductsService } from './products.service.js';

@Module({
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
```

Register the module in the application's root module.
