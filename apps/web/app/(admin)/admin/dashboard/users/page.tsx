import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CustomSearchBar from "@/components/admin_dashboard/custom_search";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Unauthorized from "@/components/ui/unauthorized";
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";
import { User, UserResponse } from "@repo/types";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function getUsers({
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
        const url = new URL(`${BACKEND_URL}/admin/moderate/user/all`);
        if (query) url.searchParams.append('term', query);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch data");
        }
        return resData as {
            results: UserResponse[]
            has_next_page: boolean
        };
    }
    catch (err: any) {
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
        return <Unauthorized />;
    }
    const sp = await searchParams;
    const limit = parseInt((Array.isArray(sp.limit) ? sp.limit[0] : sp.limit) || "10");
    const offset = parseInt((Array.isArray(sp.offset) ? sp.offset[0] : sp.offset) || "0");
    const query = (Array.isArray(sp.query) ? sp.query[0] : sp.query) || "";
    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    const users = await getUsers({
        authToken,
        limit,
        offset,
        query
    });
    const hasNextPage = users.has_next_page;
    return <div>
        <h1 className="px-8 text-xl font-medium">User List</h1>
        <div className="overflow-hidden rounded-md border mx-8 my-2">
            <CustomSearchBar/>
            <Table >
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader className="bg-muted sticky top-0 z-10">
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead className="w-25">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.results.length > 0 && users.results.map(user => {
                        return <TableRow key={user.id} className="relative hover:bg-muted cursor-pointer">
                            <Link
                                href={`/admin/dashboard/users/${user.id}`}
                                className="absolute inset-0 z-10"
                            />
                            <TableCell className="font-medium relative">
                                {user.name}</TableCell>
                            <TableCell>
                                <p className=" border text-stone-500 dark:text-stone-400 rounded-md text-center w-fit px-1.5 text-xs">
                                    {user.role}
                                </p></TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">${(user.amount_in_cents / 100).toPrecision(3)}</TableCell>
                        </TableRow>
                    })}
                </TableBody>

            </Table>
            <ButtonGroup className="mb-2 mt-8 px-4">
                <Button variant="outline" disabled={offset <= 0}>
                    <Link
                        href={`/admin/dashboard/users?limit=${limit}&offset=${Math.max(offset - limit, 0)}`}
                    >
                        Previous
                    </Link>
                </Button>
                <Button variant="outline" disabled={!hasNextPage}>
                    <Link
                        href={`/admin/dashboard/users?limit=${limit}&offset=${offset + limit}`}
                    >Next</Link>
                </Button>
            </ButtonGroup>
        </div>
    </div>
}