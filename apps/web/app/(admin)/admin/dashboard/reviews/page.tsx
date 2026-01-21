import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ManageReview from "@/components/dashboard/manage_review";
import Unauthorized from "@/components/ui/unauthorized";
import { IconStarFilled } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";
import { ReviewResponse } from "@repo/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getReviews({ limit, offset, apiId }: {
    limit: number,
    offset: number,
    apiId?: number
}) {
    try {
        const url = new URL(`${BACKEND_URL}/reviews`);
        if (limit) url.searchParams.append('limit', limit.toString());
        if (offset) url.searchParams.append('offset', offset.toString());
        if (apiId) url.searchParams.append('api_id', apiId.toString());

        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to get reviews");
        }
        return resData as { results: ReviewResponse[], has_next_page: boolean };

    }
    catch (err) {
        throw new Error("Failed to get reviews");
    }

}

export default async function Page({ searchParams: sp }: {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />;
    }
    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    const searchParams = await sp;
    const limit = parseInt(Array.isArray(searchParams.limit) ? searchParams.limit[0] : searchParams.limit || "10");
    const offset = parseInt(Array.isArray(searchParams.offset) ? searchParams.offset[0] : searchParams.offset || "0");
    const apiId = parseInt(Array.isArray(searchParams.api_id) ? searchParams.api_id[0] : searchParams.api_id || "");
    const reviews = await getReviews({
        limit,
        offset,
        apiId
    })
    return <div className="border p-4 mx-8 rounded-md">
        {reviews.results.length > 0 && reviews.results.map(review => {
            return <div className="w-full px-8">
                <div className="flex flex-col sm:flex-row space-x-2 w-full items-start sm:items-center  justify-between">
                    <div className="flex space-x-2 items-center justify-center">
                        <Avatar>
                            <AvatarImage
                                src={review.image}
                                alt="@shadcn"
                                className="grayscale"
                            />
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-sm font-bold font-sans">{review.name}</h2>
                            <div className="text-yellow-400 flex">
                                <IconStarFilled size={15} />
                                <IconStarFilled size={15} />
                                <IconStarFilled size={15} />
                                <IconStarFilled size={15} />
                                <IconStarFilled size={15} />
                            </div>
                        </div>
                    </div>
                    <div className="my-2">
                        <ManageReview reviewId={"1"} authToken={authToken} currentValue={review.status} />
                    </div>
                </div>
                <p className="text-sm tracking-tight">{review.content}</p>
            </div>
        })}

        <ButtonGroup className="mb-2 mt-8 px-4">
            <Button variant="outline" disabled={offset <= 0}>
                <Link
                    href={`/admin/dashboard/reviews?limit=${limit}&offset=${Math.max(offset - limit, 0)}&api_id=${apiId}`}
                >
                    Previous
                </Link>
            </Button>
            <Button variant="outline" disabled={!reviews.has_next_page}>
                <Link
                    href={`/admin/dashboard/reviews?limit=${limit}&offset=${offset + limit}&api_id=${apiId}`}
                >Next</Link>
            </Button>
        </ButtonGroup>
    </div>
}