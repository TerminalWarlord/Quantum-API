"use client";

import SearchBar from "@/components/searchbar";
import { Card } from "@/components/ui/card";
import { IconActivityHeartbeat, IconChartHistogram, IconCurrencyDollar, IconDotsVertical, IconEdit, IconGlobe, IconLoader, IconSettings, IconTrash } from "@tabler/icons-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ApiResult, ApiStatus } from "@repo/types";
import { cn } from "@/lib/utils";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";


import Dashboard_Card from "@/components/ui/dashboard_card";
import PageInfo from "@/components/user_dashboard/page_info";
import Pagination from "../ui/pagination";
import { useEffect, useState } from "react";
import { fetchApis } from "@/lib/browse/get_apis";
import { useSession } from "next-auth/react";
import { toast } from "sonner";


const APIS = [
    {
        title: "Game of thrones",
        created_at: new Date(),
        status: ApiStatus.ENABLED,
        slug: "got",
        thumbnail_url: "https://thronesapi.com/assets/images/daenerys.jpg"
    },
    {
        title: "Game of thrones 2",
        created_at: new Date(),
        status: ApiStatus.ENABLED,
        slug: "got-2",
        thumbnail_url: "https://thronesapi.com/assets/images/daenerys.jpg"
    },
    {
        title: "Game of thrones 3",
        created_at: new Date(),
        status: ApiStatus.DISABLED,
        slug: "got-3",
        thumbnail_url: "https://thronesapi.com/assets/images/daenerys.jpg"
    },
]


const ACTIONS = [
    {
        url: 'edit',
        icon: IconEdit,
        title: "Edit API"
    },
    {
        url: 'plans',
        icon: IconCurrencyDollar,
        title: "Manage Plans"
    },
    {
        url: 'endpoints',
        icon: IconSettings,
        title: "Manage Endpoints"
    },
    {
        url: 'analytics',
        icon: IconChartHistogram,
        title: "View Analytics"
    }
]


export default function UserApis() {
    const [data, setData] = useState<ApiResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query");
    const offset = parseInt(searchParams.get("offset") || "0");
    const session = useSession();
    const path = usePathname();

    useEffect(() => {
        if (!session || !session.data?.user.id) return;
        const fetchData = async () => {
            setIsLoading(true);
            setData(null);
            try {
                const apis = await fetchApis({
                    limit,
                    offset,
                    user_id: session.data.user.id,
                    query: query
                });
                setData(apis);
            }
            catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                }
                else {
                    toast.error("Failed to fetch APIs");
                }
            }
            setIsLoading(false);
        }
        fetchData();
    }, [session, limit, offset, query]);

    return <div className="">
        
        <Card className="gap-0 py-6 px-6 my-6">
            <h4 className="text-lg font-medium my-2">Your APIs</h4>
            <SearchBar placeholder="Search..." />

            {isLoading && <div className="flex items-center justify-center my-16 w-full">
                <IconLoader className="animate-spin" />
            </div>}
            {data && data.results.length > 0 && <Table className="my-6">
                <TableHeader>
                    <TableRow>
                        <TableHead className=" md:w-2/3">API</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.results.map(api => {
                        return <TableRow key={api.slug}>
                            <TableCell>
                                <div className="flex space-x-3 items-center">
                                    <img src={api.thumbnail_url} className="rounded-md h-12 w-12" />
                                    <div className="flex flex-col">
                                        <h1 className="font-medium">{api.title}</h1>
                                        <p className="text-xs text-neutral-500">Created at {new Date(api.created_at!.toString()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p
                                    className={cn(
                                        "border text-xs px-1 py-0.5 w-fit h-fit rounded-md font-medium",
                                        api.status === ApiStatus.ENABLED ? "bg-green-300/10  border-green-300 text-green-700/50" : "bg-red-300/10  border-red-300 text-red-700/50"
                                    )}
                                >
                                    {api.status}
                                </p>
                            </TableCell>
                            <TableCell>
                                <Menubar className="shadow-none border-0 bg-transparent">
                                    <MenubarMenu>
                                        <MenubarTrigger className="shadow-none hover:bg-transparent border-0 bg-transparent p-1 rounded-full">
                                            <IconDotsVertical className="w-4 h-4 cursor-pointer" />
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            {ACTIONS.map(action => {
                                                const url = `${path}/${api.slug}/${action.url}`;
                                                return <MenubarItem key={action.url}>
                                                    <Link href={url} className="flex space-x-2 text-neutral-700 items-center">
                                                        {/* <IconEdit /> */}
                                                        <action.icon />
                                                        <span>{action.title}</span>
                                                    </Link>
                                                </MenubarItem>
                                            })}
                                            <MenubarSeparator />
                                            <MenubarItem>
                                                <Link href={''} className="flex space-x-2 text-red-700 items-center">
                                                    <IconTrash className="text-red-700" />
                                                    <span>Delete API</span>
                                                </Link>
                                            </MenubarItem>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </TableCell>

                        </TableRow>
                    })}
                </TableBody>
            </Table>}
            <Pagination hasNextPage={data?.has_next_page || false} />
        </Card>
    </div>

}