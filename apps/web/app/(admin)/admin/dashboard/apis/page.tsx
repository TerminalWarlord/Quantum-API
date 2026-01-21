import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";
import { getServerSession } from "next-auth"
import jwt from "jsonwebtoken";
import { IconActivity, IconBox, IconCurrencyDollar, IconPackage, IconUsers } from "@tabler/icons-react";
import Unauthorized from "@/components/ui/unauthorized";
import { ApiResponse, DashboardOverview } from "@repo/types";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import NoResults from "@/components/ui/no_results";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomSearchBar from "@/components/dashboard/custom_search";

async function getApis({
    authToken,
    limit,
    offset,
    query
}: {
    authToken: string,
    limit: number,
    offset: number,
    query: string
}) {
    try {
        const url = new URL(`${BACKEND_URL}/admin/overview/apis`);
        if (query) url.searchParams.append('query', query);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (res.status === 401) {
            throw new Error("Unauthorized");
        }
        else if (res.status === 403) {
            throw new Error("Forbidden");
        }
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch data");
        }
        return resData as { results: ApiResponse[], has_next_page: boolean };
    }
    catch (err: any) {
        console.log(err);
        throw new Error(err.message || "Failed to fetch data");
    }
}

export default async function Page({ searchParams }: {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />
    }
    const sp = await searchParams;
    const query = (Array.isArray(sp.query) ? sp.query[0] : sp.query) || "";
    const limit = parseInt((Array.isArray(sp.limit) ? sp.limit[0] : sp.limit) || "20");
    const offset = parseInt((Array.isArray(sp.offset) ? sp.offset[0] : sp.offset) || "0");
    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    const apis = await getApis({
        authToken,
        limit: limit,
        offset: offset,
        query: query
    });

    return (
        <div className="flex w-full min-w-0 px-8">
            <div className="px-4 py-4 border rounded-xl shadow-sm w-full">
                <CustomSearchBar className="my-4 px-2"/>
                {apis.results.length > 0 ? apis.results.map((api, idx) => {
                    return <div className="px-4 py-2">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 space-x-0 justify-between">
                            <div className="flex space-x-2">
                                <div className="h-10 w-10 p-1 bg-cyan-50 dark:bg-cyan-50/10 border border-cyan-600/50 rounded-md flex items-center justify-center">
                                    {api.thumbnail_url ? <img src={api.thumbnail_url} width={100} height={100} alt={`${api.title} API's thumbnail`} /> : <IconBox className="text-cyan-600" />}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm md:text-md tracking-tight font-medium">{api.title}</p>
                                    <Link
                                        className="text-xs tracking-tighter text-stone-700 dark:text-stone-100 bg-stone-200/70 dark:bg-stone-700 w-fit px-1.5 rounded-md"
                                        href={'/browse?category_slug' + api.category_slug}>{api.category_name}</Link>
                                </div>
                            </div>
                            <div>
                                <p className="border tracking-tighter rounded-md px-1.5 py-0.5 bg-linear-to-r from-stone-200 dark:from-stone-800 dark:to-stone-800/80 to-stone-200/80 text-xs md:text-sm">{api.total_subscribers} Subscribers</p>
                            </div>


                        </div>
                        {idx !== apis.results.length - 1 && <Separator className="mt-3" />}
                    </div>
                }) : <NoResults />}
                <ButtonGroup className="mb-2 mt-8">
                    <Button variant="outline" disabled={offset <= 0}>
                        <Link
                            href={`/admin/dashboard/apis?limit=${limit}&offset=${Math.max(offset - limit, 0)}`}
                        >
                            Previous
                        </Link>
                    </Button>
                    <Button variant="outline" disabled={!apis.has_next_page}>
                        <Link
                            href={`/admin/dashboard/apis?limit=${limit}&offset=${offset + limit}`}
                        >Next</Link>
                    </Button>
                </ButtonGroup>
            </div>
        </div >
    )
}
