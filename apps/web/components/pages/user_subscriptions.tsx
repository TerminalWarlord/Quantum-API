"use client";

import { IconDotsVertical, IconLoader, IconTrash } from "@tabler/icons-react";
import SearchBar from "../searchbar";
import { Card } from "../ui/card";
import PageInfo from "../user_dashboard/page_info";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Pagination from "../ui/pagination";
import { SubscriptionStatusEnums, UserSubscription } from "@repo/types";
import { Button } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";

type UserSubscriptionsProps = {
    subscriptions: UserSubscription[];
    hasNextPage: boolean
}

export default function UserSubscriptions({ subscriptions, hasNextPage }: UserSubscriptionsProps) {
    const path = usePathname();
    const searchParams = useSearchParams();
    return <div className="px-8">
        <PageInfo
            title="Subscriptions"
            description="Manage your API subscriptions and usage"
        />

        <Card className="gap-0 py-6 px-6 my-6">
            <h4 className="text-lg font-medium my-2">Your APIs</h4>
            <SearchBar placeholder="Search..." />


            {subscriptions && subscriptions.length > 0 && <Table className="my-6">
                <TableHeader>
                    <TableRow>
                        <TableHead className=" md:w-2/3">API</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="w-20 text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptions.map(sub => {
                        const detailUrl = `${path}/${sub.subscription_id}`
                        return <TableRow key={sub.slug}>
                            <TableCell>
                                <div className="flex space-x-3 items-center">
                                    <img src={sub.thumbnail_url} className="rounded-md h-12 w-12" />
                                    <div className="flex flex-col">
                                        <div className="flex space-x-2">
                                            <h1 className="font-medium">{sub.title}</h1>
                                            <p
                                                className={cn(
                                                    "border text-[0.5rem] px-1 w-fit h-fit rounded-md font-medium",
                                                    sub.status === SubscriptionStatusEnums.active ? "bg-green-300/10  border-green-300 text-green-700/50 dark:text-green-300 dark:bg-green-300/20" : "bg-red-300/10  border-red-300 text-red-700/50"
                                                )}
                                            >
                                                {sub.status.toLocaleUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs">{sub.category_name}</p>
                                        </div>

                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-xs text-neutral-500">From {new Date(sub.current_period_start!.toString()).toLocaleDateString()}</p>
                                <p className="text-xs text-neutral-500">to {new Date(sub.current_period_end!.toString()).toLocaleDateString()}</p>
                            </TableCell>
                            <TableCell>
                                <p className="text-center">{(sub.price_in_cents / 100).toFixed(2)}</p>
                            </TableCell>
                            <TableCell>
                                <Button>
                                    <Link href={detailUrl}>Details</Link>
                                </Button>
                            </TableCell>

                        </TableRow>
                    })}
                </TableBody>
            </Table>}
            <Pagination hasNextPage={hasNextPage || false} />
        </Card>
    </div>
}