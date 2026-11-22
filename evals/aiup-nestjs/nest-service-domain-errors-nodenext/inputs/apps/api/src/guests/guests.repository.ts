import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DbExecutor, type DrizzleDb } from '../database/drizzle.provider.js';
import { guests } from '../database/schema.js';

export type GuestRow = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;

@Injectable()
export class GuestsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async findByEmail(email: string): Promise<GuestRow | undefined> {
    return (await this.db.select().from(guests).where(eq(guests.email, email)).limit(1))[0];
  }

  async insert(values: NewGuest, tx: DbExecutor = this.db): Promise<GuestRow> {
    const [row] = await tx.insert(guests).values(values).returning();
    return row;
  }
}
