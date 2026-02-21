import { Session } from "next-auth";


export async function createToken(session: Session | null) {
    if (!session || !session.user.id) {
        throw new Error("You are not logged in");
    }
    const tokenRes = await fetch('/api/token', {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
            id: session.user.id
        })
    });
    if (!tokenRes.ok) {
        throw new Error("Failed to generate token!");
    }
    const { token } = await tokenRes.json();
    return token;
}