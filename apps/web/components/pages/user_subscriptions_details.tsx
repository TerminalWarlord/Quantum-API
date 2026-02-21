"use client";

import { IconBolt, IconCalendar, IconDotsVertical, IconLoader, IconTimeline, IconTrash } from "@tabler/icons-react";
import SearchBar from "../searchbar";
import { Card } from "../ui/card";
import PageInfo from "../user_dashboard/page_info";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "../ui/menubar";
import Link from "next/link";
import Pagination from "../ui/pagination";
import { BACKEND_URL } from "@/lib/config";
import { SubscriptionStatusEnums, UserSubscription } from "@repo/types";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { createToken } from "@/lib/create_token";
import Loading from "../ui/loading";
import Dashboard_Card from "../ui/dashboard_card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ManageSubscription from "../user_dashboard/subscriptions/manage_subscription";
import ApiKeyTab from "../user_dashboard/subscriptions/api_key_tab";
import UserUsageAnalytics from "../user_dashboard/subscriptions/user_usage_analytics";

type UserSubscriptionDetailsProps = {
    subscriptionId: number
}

const fetcher = async ([url, session]: [url: string, session: Session | null]) => {
    if (!session || !session.user.id) return;
    const token = await createToken(session);
    const res = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return await res.json();
}

export default function UserSubscriptionDetails({ subscriptionId }: UserSubscriptionDetailsProps) {
    const session = useSession();
    const { data, isLoading, error } = useSWR(
        session.status === "authenticated" ? [`${BACKEND_URL}/manage/subscriptions/${subscriptionId}`, session.data] : null, fetcher
    )
    // const data = {
    //     "results": {
    //         "title": "Instagram API",
    //         "description": "This is a demo API",
    //         "slug": "instagram-api-sK-g",
    //         "thumbnail_url": "https://freepnglogo.com/images/all_img/1715966585instagram-lite-logo.png",
    //         "name": "Enterprice",
    //         "status": "active",
    //         "current_period_start": "2026-01-21 14:22:52.245",
    //         "current_period_end": "2026-02-21 14:22:52.245",
    //         "monthly_requests": "100000",
    //         "rate_limit": "10000",
    //         "price_in_cents": 1475,
    //         "provider_subscription_id": "sub_01kfgeznf6s1byzx5pe8n5t885",
    //         "current_month_requests": "9",
    //         "usages": [
    //             {
    //                 "period": "hour",
    //                 "data": []
    //             },
    //             {
    //                 "period": "day",
    //                 "data": [
    //                     {
    //                         "timestamp": "2026-01-22 00:00:00",
    //                         "label": "2026-01-21",
    //                         "value": 0
    //                     }
    //                 ]
    //             },
    //             {
    //                 "period": "month",
    //                 "data": [
    //                     {
    //                         "timestamp": "2026-01-01 00:00:00",
    //                         "label": "Dec 31",
    //                         "value": 0
    //                     }
    //                 ]
    //             },
    //             {
    //                 "period": "year",
    //                 "data": [
    //                     {
    //                         "timestamp": "2026-01-01 00:00:00",
    //                         "label": "2025",
    //                         "value": 0
    //                     }
    //                 ]
    //             }
    //         ],
    //         "provider_data": {
    //             "action": "cancel",
    //             "effective_at": "2026-02-21T14:22:52.245043Z",
    //             "resume_at": null
    //         }
    //     }
    // };
    const path = usePathname();
    const searchParams = useSearchParams();
    return <div className="px-8">
        <PageInfo
            title="Subscription Details"
            description="Manage your API subscription"
        />
        {isLoading && <Loading />}
        {data && data.results && <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
                <img
                    src={data.results.thumbnail_url}
                    className="rounded-md w-15 h-15"
                />
                <div>
                    <div className="flex space-x-2 items-center">
                        <h1 className="text-lg font-semibold">{data.results.title}</h1>
                        <p
                            className={cn(
                                "border text-[0.6rem] px-1 w-fit h-fit rounded-md font-medium",
                                data.results.status === SubscriptionStatusEnums.active ? "bg-green-300/10  border-green-300 text-green-700/50 dark:text-green-300 dark:bg-green-300/20" : "bg-red-300/10  border-red-300 text-red-700/50"
                            )}
                        >
                            {data.results.status.toLocaleUpperCase()}
                        </p>
                    </div>
                    <p className="text-sm flex space-x-1 text-neutral-600">
                        <span>
                            {data.results.name}
                        </span>
                        <span>•</span>
                        <span className="">
                            ${(data.results.price_in_cents / 100).toFixed(2)}/mo
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <h2 className="font-semibold text-xl">Description</h2>
                <p className="text-neutral-600 dark:text-neutral-300">{data.results.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Dashboard_Card
                    icon={IconCalendar}
                    title="Period"
                    value={``}
                >
                    <p className="font-medium text-sm">{new Date(data.results.current_period_start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    })}</p>
                    <p className="text-neutral-500 text-xs"> to {new Date(data.results.current_period_end).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                    })}</p>
                </Dashboard_Card>
                <Dashboard_Card
                    icon={IconTimeline}
                    title="Monthly Requests"
                    value=""
                >
                    <p className="text-lg md:text-xl lg:text-2xl font-bold">{data.results.current_month_requests ?? 0}/{data.results.monthly_requests}</p>
                </Dashboard_Card>
                <Dashboard_Card
                    icon={IconBolt}
                    title="Rate Limit"
                    value={data.results.rate_limit}
                >
                    <p className="text-xs text-neutral-600">requests/hour</p>
                </Dashboard_Card>
            </div>
            <Tabs defaultValue="analytics" className="">
                <TabsList>
                    <TabsTrigger value="analytics">Usage</TabsTrigger>
                    <TabsTrigger value="api_key">API Key</TabsTrigger>
                    <TabsTrigger value="manage_subscription">Manage</TabsTrigger>
                </TabsList>
                <UserUsageAnalytics subscriptionId={subscriptionId} />
                {/* <TabsContent value="api_key">Change your password here.</TabsContent> */}
                <ApiKeyTab subscriptionId={subscriptionId} />
                <ManageSubscription subscription={{ ...data.results, subscription_id: subscriptionId } as unknown as UserSubscription} />
            </Tabs>
        </div>}
    </div>
}