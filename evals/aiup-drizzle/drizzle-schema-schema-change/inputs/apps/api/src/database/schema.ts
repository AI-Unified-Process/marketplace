import { boolean, doublePrecision, integer, pgTable, text } from 'drizzle-orm/pg-core';

export const category = pgTable('category', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const products = pgTable('product', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  category: text().notNull(),
  price: doublePrecision().notNull(),
  inStock: boolean('in_stock').notNull().default(true),
});
