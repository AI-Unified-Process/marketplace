import { date, integer, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const guests = pgTable(
  'guest',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    birthDate: date('birth_date').notNull(),
    registeredAt: timestamp('registered_at', { withTimezone: true }).notNull(),
    note: text(),
  },
  (table) => [uniqueIndex('guest_email_uk').on(table.email)],
);
