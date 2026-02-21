"use client";

import SearchBar from "@/components/searchbar";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BACKEND_URL } from "@/lib/config";
import { createToken } from "@/lib/create_token";
import { Page } from "@repo/types";
import { IconDotsVertical, IconExternalLink, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";


const fetcher = async (urlPath: string, session: Session | null, offset: number, limit: number, query?: string | null) => {
    try {
        if (!session || !session.user.id) return;
        const token = await createToken(session);
        const url = new URL(`${BACKEND_URL}/${urlPath}`);
        url.searchParams.set('offset', offset.toString());
        url.searchParams.set('limit', limit.toString());
        if (query) {
            url.searchParams.set('query', query);
        }
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.message || "Failed to fetch posts");
        }
        return resData as {
            results: Page[],
            has_next_page: boolean
        };
    }
    catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
        }
        else {
            toast.error("Failed to fetch posts");
        }
    }
}

export default function AllPages() {
    const session = useSession();
    const searchParams = useSearchParams();
    const limit = parseInt(searchParams.get('limit') || "10");
    const offset = parseInt(searchParams.get('offset') || "0");
    const query = searchParams.get('query');
    const { data, isLoading, error } = useSWR(session.status === "authenticated" ? `admin/moderate/pages` : null, (url) => fetcher(
        url,
        session.data,
        offset,
        limit,
        query
    ));

    return <div>
        <Button className="my-4">
            <IconPlus className="w-5 h-5"/>
            <span>Create Page</span>
        </Button>
        {isLoading && < Loading />}


        {data && data.results.length > 0 && <div>
            <SearchBar />
            <Table className="my-6">
                <TableHeader>
                    <TableRow>
                        <TableHead className=" md:w-2/3">Page</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.results.map(page => {
                        return <TableRow key={page.slug}>
                            <TableCell className="flex space-x-2">
                                <h2>{page.title}</h2>
                                <Link href={`/${page.slug}`}><IconExternalLink className="w-4 h-4" /></Link>
                            </TableCell>
                            <TableCell>
                                <p
                                    className="text-xs border w-fit px-1.5 rounded-md text-neutral-500 dark:text-neutral-300"
                                >
                                    {page.status}
                                </p>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-1">
                                    <Link href={'edit'}><IconPencil className="w-5 h-5" /></Link>
                                    <Link href={'delete'}><IconTrash className="w-5 h-5 text-red-400" /></Link>
                                </div>
                            </TableCell>

                        </TableRow>
                    })}
                </TableBody>
            </Table>
            <Pagination
                hasNextPage={data?.has_next_page ?? false}
            />
        </div>}
    </div>
}