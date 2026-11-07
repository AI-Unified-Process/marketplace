<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Worked example: orders

The persistence layer of two use cases: UC-029 lists orders (a read with a filter and paging), UC-030 places an order
(a write across two repositories). Every relative import ends in `.js` because the layout detection found NodeNext;
drop the suffix where it did not.

## Read path (UC-029)

```ts
// src/orders/order.types.ts
import type { orders, orderLines } from '../database/schema.js';

export type OrderRow = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type NewOrderLine = typeof orderLines.$inferInsert;
export type OrderListItem = { id: number; orderNumber: string; customerName: string };
export type OrderFilter = { customerName?: string; openOnly?: boolean };
```

```ts
// src/orders/orders.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, ilike } from 'drizzle-orm';
import { DRIZZLE, type DbExecutor, type DrizzleDb, type Tx } from '../database/drizzle.provider.js';
import { customers, orderLines, orders } from '../database/schema.js';
import type { NewOrder, NewOrderLine, OrderFilter, OrderListItem, OrderRow } from './order.types.js';

@Injectable()
export class OrdersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  private where(filter: OrderFilter) {
    return and(
      filter.customerName ? ilike(customers.name, `%${filter.customerName}%`) : undefined,
      // UC-029 BR-001: The open orders view hides cancelled orders.
      filter.openOnly ? eq(orders.status, 'OPEN') : undefined,
    );
  }

  async findAll(filter: OrderFilter, offset: number, limit: number): Promise<OrderListItem[]> {
    return this.db
      .select({ id: orders.id, orderNumber: orders.orderNumber, customerName: customers.name })
      .from(orders)
      .innerJoin(customers, eq(orders.customerId, customers.id))
      .where(this.where(filter))
      .orderBy(asc(orders.orderNumber), asc(orders.id))
      .limit(limit)
      .offset(offset);
  }
```

The projection names its columns, so `OrderListItem` holds what the list shows and nothing else. `and(...)` ignores the
`undefined` of an unset filter. The `id` in `orderBy` keeps page boundaries stable when two order numbers tie.

## Write path (UC-030)

Placing an order inserts the order and its lines and reserves stock. All of it succeeds or none of it does, and it
spans `OrdersRepository` and `ProductsRepository`.

```ts
// src/orders/orders.repository.ts — added to the class above
  transaction<T>(work: (tx: Tx) => Promise<T>): Promise<T> {
    return this.db.transaction(work);
  }

  async insert(values: NewOrder, tx: DbExecutor = this.db): Promise<OrderRow> {
    const [row] = await tx.insert(orders).values(values).returning();
    return row;
  }

  async insertLines(values: NewOrderLine[], tx: DbExecutor = this.db): Promise<void> {
    await tx.insert(orderLines).values(values);
  }
}
```

```ts
// src/products/products.repository.ts — added to the class
  async reserveStock(id: number, quantity: number, tx: DbExecutor = this.db): Promise<boolean> {
    const rows = await tx
      .update(products)
      .set({ stock: sql`${products.stock} - ${quantity}` })
      // UC-030 BR-002: An order never takes more than the stock on hand.
      .where(and(eq(products.id, id), gte(products.stock, quantity)))
      .returning({ id: products.id });
    return rows.length > 0;
  }
```

The stock check sits in the `where` of the update, so two concurrent orders cannot both pass it. A read followed by a
write would let them.

The service, built by the layer above, passes the handle along and runs nothing on it:

```ts
await this.orders.transaction(async (tx) => {
  const order = await this.orders.insert(newOrder, tx);
  await this.orders.insertLines(lines.map((line) => ({ ...line, orderId: order.id })), tx);
  for (const line of lines) {
    if (!(await this.products.reserveStock(line.productId, line.quantity, tx))) {
      throw new OutOfStockError(line.productId); // rolls the whole order back
    }
  }
});
```

A method called without `tx` falls back to `this.db`, so `insert` also serves a use case that needs no transaction.
Forgetting `tx` inside the callback compiles and is the mistake to look for: that statement commits on its own.
