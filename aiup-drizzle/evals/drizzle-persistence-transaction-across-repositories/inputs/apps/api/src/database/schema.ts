import { date, doublePrecision, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const products = pgTable('product', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  price: doublePrecision().notNull(),
  stock: integer().notNull().default(0),
});

export const purchaseOrders = pgTable('purchase_order', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderDate: date('order_date').notNull(),
  customerName: text('customer_name').notNull(),
});

export const orderLines = pgTable('order_line', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id')
    .notNull()
    .references(() => purchaseOrders.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
});
