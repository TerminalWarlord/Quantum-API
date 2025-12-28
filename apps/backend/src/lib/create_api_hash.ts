// TODO: Study Collision probablity and SHA256
// Current approach:
// STEP 1: Generate a 32 bytes hash
// STEP 2: Convert the hash into base64url string
// STEP 3: Generate a new hash using SHA256 for that string (https://www.youtube.com/watch?v=PbFVTb7Pndc)
// STEP 4: Store apiKeyHash in the DB
// STEP 5: For incoming requests, first generate SHA256 hash string 
// STEP 6: Compare that with key_hash value in db

import { randomBytes, createHash } from "crypto";

export const createApiHash = () => {
    const raw = randomBytes(32);
    const apiKey = raw.toString("base64url");
    const apiKeyHash = createHash("sha256")
        .update(apiKey)
        .digest("hex");
    return {
        apiKey,
        apiKeyHash
    }
}