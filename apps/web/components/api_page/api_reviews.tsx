"use client";


import { BACKEND_URL } from "@/lib/config"
import { createReviewStars, getReviews } from "@/lib/get_reviews"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import Loading from "../ui/loading";
import Pagination from "../ui/pagination";
import AddReview from "../add_review";
import ReviewCard from "./review_card";
import NoResults from "../ui/no_results";

type ApiReviewsProps = {
    apiSlug: string
}

export default function ApiReviews({ apiSlug }: ApiReviewsProps) {
    const searchParams = useSearchParams();
    const offset = parseInt(searchParams.get('offset') || "0");
    const limit = parseInt(searchParams.get('limit') || "10");
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/reviews?${searchParams.toString()}`, () => getReviews({
        limit,
        offset,
        apiSlug
    }))
    return <div className="my-6">
        <h2 className="text-xl font-semibold my-4">Reviews</h2>
        <AddReview apiSlug={apiSlug} />
        {isLoading && <Loading />}
        {data && data.results && data.results.length === 0 && <NoResults resultType="Reviews yet" />}
        {data && data.results && data.results.length > 0 && data.results.map(review => {
            return <ReviewCard review={review} key={review.id} />
        })}

        <Pagination
            hasNextPage={data?.has_next_page ?? false}
        />
    </div>

}