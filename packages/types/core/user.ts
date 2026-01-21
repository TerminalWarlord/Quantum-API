export enum AccountProvider {
    CREDENTIALS = "credentials",
    GOOGLE = "google",
    GITHUB = "github",
}

export enum UserRole {
    ADMIN = "ADMIN",
    MOD = "MOD",
    USER = "USER"
}





export interface User {
    id: number,
    first_name: string,
    last_name?: string,
    name?: string,
    username: string,
    email: string,
    image?: string
    provider?: AccountProvider
    provider_account_id?: string,
    password?: string,
    role: UserRole,
    created_at?: Date,
    updated_at?: Date
}


export type UserResponse = Pick<User, 'id' | 'name' | 'email' | 'role' | 'created_at'> & { amount_in_cents: number };