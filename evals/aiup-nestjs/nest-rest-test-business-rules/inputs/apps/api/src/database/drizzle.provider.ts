import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDb = NodePgDatabase<typeof schema>;
export type Tx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0];
export type DbExecutor = DrizzleDb | Tx;

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: (): DrizzleDb =>
    drizzle(new pg.Pool({ connectionString: process.env.DATABASE_URL }), { schema }),
};
