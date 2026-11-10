<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Worked example: the products API

The endpoints of UC-010 (list the available products) and UC-011 (create a product), on the service of the worked example
of `/nest-service`. Every relative import ends in `.js` because the layout detection found NodeNext; drop the suffix
where it did not.

## DTOs and response types

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
// src/products/dto/create-product.body.ts
import { IsDefined, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductBody {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  category!: string;

  // No @IsInt() or @Min(): BR-001 words its rejection, so the service decides (see "DTOs" of the skill).
  @IsDefined()
  price!: number;
}
```

```ts
// src/products/dto/product.response.ts
import type { Product } from '../products.repository.js';

export type ProductResponse = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export function toProductResponse(product: Product): ProductResponse {
  return { id: product.id, name: product.name, category: product.category, price: product.price };
}
```

`inStock` is on the row and absent from the response: that is what mapping means in practice.

## The controller

```ts
// src/products/products.controller.ts
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateProductBody } from './dto/create-product.body.js';
import { ListProductsQuery } from './dto/list-products.query.js';
import { toProductResponse, type ProductResponse } from './dto/product.response.js';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  /** UC-010 steps 1–2, A1: lists the products available to buy. */
  @Get()
  async list(@Query() query: ListProductsQuery): Promise<ProductResponse[]> {
    return (await this.service.listAvailable(query.category)).map(toProductResponse);
  }

  /** UC-011 steps 3–4, A1: creates a product. */
  @Post()
  async create(
    @Body() body: CreateProductBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ProductResponse> {
    const product = await this.service.create(body);
    response.location(`/api/products/${product.id}`); // only with a read by id; without one, no header and no @Res
    return toProductResponse(product);
  }
}
```

`CreateProductBody` and `ListProductsQuery` are plain imports on purpose: `import type` erases the class, and the
`ValidationPipe` then has nothing to validate against.

## The validation pipe

Only for a project that has none. The `exceptionFactory` keeps the property name of every violation, nested ones with a
dotted path, so the filter can answer `errors: [{ field, message }]`.

```ts
// src/common/validation.pipe.ts
import { BadRequestException, ValidationPipe, type ValidationError } from '@nestjs/common';

export type FieldError = { field: string; message: string };

function fieldErrors(errors: ValidationError[], parent = ''): FieldError[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    return [
      ...Object.values(error.constraints ?? {}).map((message) => ({ field, message })),
      ...fieldErrors(error.children ?? [], field),
    ];
  });
}

export const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors) =>
    new BadRequestException({ message: 'The request is invalid.', errors: fieldErrors(errors) }),
});
```

## The exception filter

Only for a project that has none. An existing filter gets the new errors added instead.

```ts
// src/common/problem-details.filter.ts
import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { BusinessRuleError, NotFoundError } from './errors.js';
import type { FieldError } from './validation.pipe.js';

@Catch(BusinessRuleError, NotFoundError, HttpException)
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.status(exception);
    const body: Record<string, unknown> = {
      type: exception instanceof HttpException ? 'about:blank' : `urn:problem:${exception.name}`,
      title: exception.name,
      status,
      detail: exception.message,
    };
    const errors = this.fieldErrors(exception);
    if (errors) {
      body.detail = 'The request is invalid.';
      body.errors = errors;
    }
    response.status(status).type('application/problem+json').send(body);
  }

  private status(exception: Error): number {
    if (exception instanceof HttpException) return exception.getStatus();
    return exception instanceof NotFoundError ? 404 : 409;
  }

  // The validation pipe answers with a BadRequestException that carries the field errors.
  private fieldErrors(exception: Error): FieldError[] | undefined {
    if (!(exception instanceof HttpException)) return undefined;
    const response = exception.getResponse();
    const errors = typeof response === 'object' ? (response as { errors?: unknown }).errors : undefined;
    return Array.isArray(errors) ? (errors as FieldError[]) : undefined;
  }
}
```

Express's `type('application/problem+json')` keeps the media type; `send` with an object then writes JSON. Register the
pipe with `APP_PIPE` and the filter with `APP_FILTER` in the root module, as section "Validation" of the skill shows.
