import { db, userTable, eq, and, sql, or } from "@repo/db/client";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AccountProvider, User } from "@repo/types";
import { verifyPassword } from "@repo/shared/password_helper";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: number,
            username: string,
        }
    }

    interface User {
        id: number,
        username: string,
        email: string,
        image?: string,
    }
}





export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "johndoe@gmail.com" },
                username: { label: "Username", type: "text", placeholder: "johndoe" },
                first_name: { label: "First Name", type: "text", placeholder: "John" },
                last_name: { label: "Last Name", type: "text", placeholder: "Doe" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials || (!credentials.email && !credentials.username) || !credentials.password) {
                    throw new Error("Email/Username and Password are required!");
                }
                const identifier = credentials.email ?? credentials.username;
                const res = await db.execute(sql`
                    SELECT 
                        id,
                        password,
                        email,
                        username,
                        first_name,
                        last_name,
                        role,
                        image
                    FROM users
                    WHERE
                        (email = ${identifier}
                        OR username = ${identifier})
                        AND provider = 'credentials'
                    LIMIT 1;
                `)
                if (!res.rowCount) {
                    throw new Error("Invalid credentials!");
                }

                const { password, ...result } = res.rows[0] as unknown as User;
                const isPasswordValid = await verifyPassword(credentials.password, password!);
                if (!isPasswordValid) {
                    throw new Error("Invalid Password!");
                }
                return result;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "SECRET",
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (trigger === "signIn" && user) {
                console.log("JWT", user);
                token.id = user.id as number;
                token.username = user.username;
            }

            return token;
        },

        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as number;
                session.user.username = token.username as string;
            }

            return session;
        },
        // login or add new user
        async signIn({ user, account, profile }) {
            if (!account) return false;
            // handle credentials login using CredentialsProvider
            if (account.provider === "credentials") {
                return true;
            }

            try {
                const provider = account.provider as AccountProvider;
                const providerAccountId = account?.providerAccountId;

                const [existingUser] = await db.select()
                    .from(userTable)
                    .where(
                        and(eq(userTable.provider, provider), eq(userTable.provider_account_id, providerAccountId))
                    ).limit(1);
                if (existingUser) {
                    user.id = existingUser.id
                    user.username = existingUser.username
                    console.log("SETTING up ID", existingUser.id)
                    return true;
                }
                const name = profile?.name;
                const email = profile?.email;
                if (!name || !email) return false;
                const image = profile?.image;

                // TODO: add username
                const [newUser] = await db.insert(userTable).values({
                    email,
                    image,
                    provider,
                    first_name: name,
                    username: email,
                    provider_account_id: account.providerAccountId

                }).returning();
                if (!newUser) {
                    return false;
                }
                user.id = newUser.id
                user.username = newUser.username
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        },


    },
    // debug: true

};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }