import Redis from "ioredis";
import { config } from "dotenv";

config({ path: "../../.env" });


const globalThis = global as unknown as { redis: Redis };
export const redis = globalThis.redis || new Redis(process.env.REDIS_URL || "");