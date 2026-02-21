"use client";

import Dashboard_Card from "@/components/ui/dashboard_card";
import Loading from "@/components/ui/loading";
import PageInfo from "@/components/user_dashboard/page_info";
import UserApis from "@/components/user_dashboard/user_apis";
import { BACKEND_URL } from "@/lib/config";
import { createToken } from "@/lib/create_token";
import { IconActivityHeartbeat, IconCurrencyDollar, IconGlobe } from "@tabler/icons-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR from "swr";


const fetcher = async ([url, session]: [url: string, session: Session | null]) => {
    try {
        if (!session || !session.user.id) return;
        const token = await createToken(session);
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.message || "Failed to fetch data");
        }
        return resData.results as {
            total_requests: number,
            active_subscribers: number,
            total_revenue: number
        };
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error) {
            toast.error(err.message);
        } else toast.error("Failed to fetch data");
    }
}

export default function Page() {
    const session = useSession();
    const { data, isLoading, error } = useSWR([`${BACKEND_URL}/manage/api/analytics/overview/`, session.data], fetcher);
    return <div className="px-4 md:px-8 font-inter my-6">
        <PageInfo title="My APIs" description="Manage and monitor the APIs you've created" />
        {isLoading && <Loading />}
        {data && <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Dashboard_Card icon={IconGlobe} title="Total Revenue" value={`$${(data.total_revenue/100).toFixed(2)}`} />
            <Dashboard_Card icon={IconCurrencyDollar} title="Total Active Subscribers" value={data.active_subscribers.toString()} />
            <Dashboard_Card icon={IconActivityHeartbeat} title="Total Requests" value={data.total_requests.toString()} />
        </div>}

        <UserApis />
    </div>
}