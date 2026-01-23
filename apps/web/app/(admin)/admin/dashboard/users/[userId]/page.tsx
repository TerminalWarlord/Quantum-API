import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RemoveUser from "@/components/admin_dashboard/remove_user";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import Dashboard_Card from "@/components/ui/dashboard_card";
import NoResults from "@/components/ui/no_results";
import { Separator } from "@/components/ui/separator";
import Unauthorized from "@/components/ui/unauthorized";
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";
import { UserSubscriptions } from "@repo/types";
import { IconApi, IconArrowLeft, IconBox, IconCreditCardPay, IconCurrencyDollar } from "@tabler/icons-react";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

async function getUsersSubscriptions({ userId, authToken, limit, offset }: {
    userId: string,
    authToken: string,
    limit: number,
    offset: number,
}) {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/moderate/user/subscriptions?user_id=${userId}&limit=${limit}&offset=${offset}`, {
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch data");
        }
        return resData as UserSubscriptions
    }
    catch (err) {
        console.log(err);
        throw new Error("Failed to fetch data");
    }
}

export default async function Page({ params, searchParams }: {
    params: Promise<{ userId: string }>,
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}) {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
        return <Unauthorized />;
    }
    const userId = (await params).userId;
    const sp = await searchParams;
    const limit = parseInt((Array.isArray(sp.limit) ? sp.limit[0] : sp.limit) || "10");
    const offset = parseInt((Array.isArray(sp.offset) ? sp.offset[0] : sp.offset) || "0");
    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    const subscriptions = await getUsersSubscriptions({
        userId,
        authToken,
        limit,
        offset
    });
    const hasNextPage = subscriptions.has_next_page;
    return <div className="px-8">
        <Link href={`/admin/dashboard/users`} className="flex space-x-3 items-center ">
            <IconArrowLeft />
            Go back to users
        </Link>
        <div>
            <RemoveUser userId={userId} authToken={authToken} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-4">

            <Dashboard_Card
                icon={IconCurrencyDollar}
                title="Total Spent"
                value={`$${(subscriptions.total_spent / 100).toPrecision(3)}`}
            />
            <Dashboard_Card
                icon={IconCreditCardPay}
                title="Active Subscriptions"
                value={subscriptions.total_subscriptions.toString()}
            />
            <Dashboard_Card
                icon={IconApi}
                title="API Published"
                value={subscriptions.total_subscriptions.toString()}
            />

        </div>
        <div className="px-4 py-4 border rounded-xl shadow-sm">
            {subscriptions.results.length > 0 ? subscriptions.results.map((sub, idx) => {
                return <div className="px-4 py-2">
                    <div className="flex space-x-2 justify-between">
                        <div className="flex space-x-2">
                            <div className="h-10 w-10 p-1 bg-cyan-50 dark:bg-cyan-50/10 border border-cyan-600/50 rounded-md flex items-center justify-center">
                                {sub.thumbnail_url ? <Image src={sub.thumbnail_url} width={100} height={100} alt={`${sub.title} API's thumbnail`}></Image> : <IconBox className="text-cyan-600" />}
                            </div>
                            <div className="flex flex-col">
                                <p className="text-md tracking-tight font-medium">{sub.title}</p>
                                <p className="text-sm text-stone-500">{sub.plan_name}</p>
                            </div>
                        </div>
                        <div className="flex flex-col text-sm text-stone-500">
                            <p>{new Date(sub.current_period_start).toDateString()}</p>
                            <p>{new Date(sub.current_period_end).toDateString()}</p>
                        </div>
                        <div>
                            <p className="text-lg font-medium">${(sub.price_in_cents / 100).toPrecision(3)}</p>
                        </div>
                    </div>
                    {idx !== subscriptions.results.length - 1 && <Separator className="mt-3" />}
                </div>
            }) : <NoResults />}
            <ButtonGroup className="mb-2 mt-8">
                <Button variant="outline" disabled={offset <= 0}>
                    <Link
                        href={`/admin/dashboard/users/${userId}?limit=${limit}&offset=${Math.max(offset - limit, 0)}`}
                    >
                        Previous
                    </Link>
                </Button>
                <Button variant="outline" disabled={!hasNextPage}>
                    <Link
                        href={`/admin/dashboard/users/${userId}?limit=${limit}&offset=${offset + limit}`}
                    >Next</Link>
                </Button>
            </ButtonGroup>
        </div>
    </div>
}