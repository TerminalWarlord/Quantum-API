import { signJwt } from "@/actions/auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserSubscriptions from "@/components/pages/user_subscriptions";
import Unauthorized from "@/components/ui/unauthorized";
import { fetchUserSubscriptions } from "@/lib/user_dashboard/get_user_subscriptions";
import { getServerSession } from "next-auth";
type PageProps = {
    searchParams: Promise<{
        [k: string]: string | string[] | undefined
    }>
}

export default async function Page({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return <Unauthorized />
    }
    const sp = (await searchParams);
    const limit = parseInt(Array.isArray(sp.limit) ? sp.limit[0] : sp.limit || "10");
    const offset = parseInt(Array.isArray(sp.offset) ? sp.offset[0] : sp.offset || "0");
    const query = Array.isArray(sp.query) ? sp.query[0] : sp.query;
    const authToken = await signJwt({ id: session.user.id });
    const subscriptions = await fetchUserSubscriptions(
        limit,
        offset,
        authToken,
        query
    )

    return <UserSubscriptions subscriptions={subscriptions.results} hasNextPage={subscriptions.has_next_page}/>
}