"use client";

import Dashboard_Card from "@/components/ui/dashboard_card";
import PageInfo from "@/components/user_dashboard/page_info";
import { IconActivityHeartbeat, IconCurrencyDollar, IconUsers } from "@tabler/icons-react";
import CustomChart from "../ui/custom-chart";
import { BACKEND_URL } from "@/lib/config";
import useSWR from "swr";
import { createToken } from "@/lib/create_token";
import { Session } from "next-auth";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Loading from "../ui/loading";

type ApiAnalyticsProps = {
    apiSlug: string
}

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
            throw new Error(resData.error || resData.message || "Failed to fetch data");
        }
        return resData.results as {
            total_requests: number,
            active_subscribers: number,
            total_revenue: number
        }
    }
    catch (err: any) {
        if (err instanceof Error) {
            toast.error(err.message);
        }
        else toast.error("Failed to fetch data");
    }
}

export default function ApiAnalytics({ apiSlug }: ApiAnalyticsProps) {
    const session = useSession();
    const { data, isLoading, error } = useSWR([`${BACKEND_URL}/manage/api/analytics/overview/${apiSlug}`, session.data], fetcher);
    return <div>
        <PageInfo
            title="Analytics"
            description="Monitor your API performance and usage"
        />
        {isLoading ? <Loading /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Dashboard_Card
                icon={IconActivityHeartbeat}
                title="Total Requests"
                value={(data?.total_requests ?? 0).toString()}
            />
            <Dashboard_Card
                icon={IconUsers}
                title="Active Subscribers"
                value={(data?.active_subscribers ?? 0).toString()}
            />
            <Dashboard_Card
                icon={IconCurrencyDollar}
                title="Monthly Revenue"
                value={`$${((data?.total_revenue ?? 0)/100).toFixed(2).toString()}`}

            />
        </div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 my-6 gap-3">
            <CustomChart
                url={`${BACKEND_URL}/manage/api/analytics/requests/${apiSlug}`}
                description="Request volume over time"
                title="API Requests"
            />
            <CustomChart
                url={`${BACKEND_URL}/manage/api/analytics/subscribers/${apiSlug}`}
                description="New subscribers count over time"
                title="Subscribers"
            />
        </div>

    </div>
}