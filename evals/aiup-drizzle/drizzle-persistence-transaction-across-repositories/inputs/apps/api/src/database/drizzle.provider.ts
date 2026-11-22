import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDb = NodePgDatabase<typeof schema>;

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: (): DrizzleDb => drizzle(process.env.DATABASE_URL as string, { schema }),
};
