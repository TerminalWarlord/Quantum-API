import { config } from "dotenv";
config({ path: "../../.env" })
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

const globalThis = global as unknown as { db: NodePgDatabase };
export const db = globalThis.db || drizzle(process.env.DATABASE_URL!);

