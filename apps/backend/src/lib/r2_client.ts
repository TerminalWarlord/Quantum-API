import { S3Client } from "bun";


const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY!;
const R2_SECRET_KEY = process.env.R2_SECRET_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_ENDPOINT_URL = process.env.R2_ENDPOINT_URL!;


const globalR2 = globalThis as unknown as { r2: S3Client };

export const r2 = globalR2.r2 || new S3Client({
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
    region: "auto",
    bucket: R2_BUCKET_NAME,
    endpoint: R2_ENDPOINT_URL
})