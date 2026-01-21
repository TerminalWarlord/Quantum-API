import bcrypt from "bcryptjs";

export async function hashPassword(password: string, cost: number = 5) {
    return await bcrypt.hash(password, cost);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
    
}
